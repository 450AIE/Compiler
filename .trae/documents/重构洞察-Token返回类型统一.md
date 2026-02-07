# 1. 问题

词法模块的 Token 生成器在字符串与数字的末尾场景存在返回类型不一致：当迭代到 EOF 或异常时，`Token.makeString` 与 `Token.makeNumber` 会返回原始字符串而不是 `Token`。这会导致 `Lexer.parse` 将非 `Token` 元素写入 `tokens` 数组，破坏下游 `PeekTokenIterator` / `Parser` 对统一输出契约的依赖。

- 影响范围：`src/Lexer/Token/index.ts` 中 `makeString` 与 `makeNumber`，以及 `Lexer.parse` 将它们的返回值直接 `push` 到 `tokens`。

## 1.1. **返回类型不一致导致契约破坏**

- 位置：`src/Lexer/Token/index.ts` 第 27-55 行（`makeString`）与第 56-127 行（`makeNumber`）。
- 现象：在迭代结束（EOF）或异常分支退出时，这两者最终走到函数末尾返回 `s: string`，而非 `Token`。
- 代表性代码（问题片段）：

```ts
// makeString: EOF 时返回 string
while (iterator.hasNext()) {
  // ... 省略状态机
}
return s; // <-- 非 Token

// makeNumber: EOF 时返回 string
while (iterator.hasNext()) {
  // ... 省略状态机
}
return s; // <-- 非 Token
```

- 为什么是问题：
  - `Lexer.parse` 会把返回值直接 `push` 到 `tokens` 数组：

```ts
// src/Lexer/index.ts
if (AlphabetChecker.isNumber(char)) {
  tokens.push(Token.makeNumber(iterator));
} else if (["'", '"'].includes(char)) {
  tokens.push(Token.makeString(iterator));
}
```

  - 一旦末尾数字或未闭合字符串出现在代码结尾，`tokens` 中将混入 `string`，而下游 `PeekTokenIterator` 假定元素为 `Token`，会调用 `getType`/`getValue`，导致运行时错误。

## 1.2. **未闭合或不完整字面量未显式抛错**

- 位置：同上。
- 现象：未闭合字符串或不完整数字（例如 `0.`、仅有正负号 `+` 或 `-`）在 EOF 时没有抛出语法错误，而是悄悄返回 `string`，使问题被掩盖。
- 后果：错误延迟到语法阶段甚至更后面才暴露，定位成本升高，测试用例也难以覆盖到隐藏的错误路径。

## 1.3. **操作符生成逻辑在 EOF 时也有相同风险（建议一并修正）**

- 位置：`src/Lexer/Token/index.ts` 第 128-281 行（`makeOperator`）。
- 现象：循环结束后同样返回 `s: string`，对于代码末尾操作符（如 `a+`），会把 `"+"` 作为字符串混入 `tokens`。
- 虽非本次上游问题的主诉点，但与统一契约一致性高度相关，建议同步修正。

# 2. 收益

一句话概述：统一词法阶段的返回契约为始终产生 `Token`（或在不合法输入时显式抛错），消除下游运行时类型不一致与隐性错误路径。

## 2.1. **稳定性提升**

- 消除 `tokens` 混入 `string` 的可能性，降低下游迭代器与解析器 `getType`/`getValue` 调用的崩溃风险。
- 预期将“类型歧义点”从 **3** 处（字符串、数字、操作符函数的尾部返回）降为 **0**。

## 2.2. **可测试性与可维护性增强**

- 错误输入在词法阶段即抛错，测试可直接断言具体异常；定位更快，职责边界更清晰。
- 单测可覆盖：数字/字符串/操作符在 EOF 的各类边界组合，避免后续阶段的耦合问题。

## 2.3. **契约清晰，接口一致**

- `Lexer.parse` 的输出恒为 `Token[]`，`Parser.parse` 与 `PeekTokenIterator` 不再需要为“潜在的字符串元素”做防御性代码。

# 3. 方案

总体思路：在 `Token.makeString`、`Token.makeNumber`（以及建议的 `Token.makeOperator`）中，统一在 EOF 或异常时抛出语法错误；在合法 EOF 结束的场景，返回 `Token` 而非 `string`。同时保证 `Lexer.parse` 所有分支都只接收 `Token`。

## 3.1. **修正 makeString：未闭合直接抛错，合法结束返回 Token**

- 实施步骤：
  - 在状态机循环结束（EOF）后，根据是否已读到闭合引号判断：未闭合则 `throw new Error`；否则返回 `Token`。
  - 保持现有状态转移与闭合判断逻辑不变，减少改动面。

- 修改前（简化示例）：

```ts
static makeString(iterator: PeekIterator) {
  let state = 0;
  let s = "";
  while (iterator.hasNext()) {
    const char = iterator.next();
    switch (state) {
      case 0: {
        if (char === '"') state = 1; else if (char === "'") state = 2;
        s += char; break;
      }
      case 1: { s += char; if (char !== '"') continue; return new Token(TokenType.STRING, s); }
      case 2: { s += char; if (char !== "'") continue; return new Token(TokenType.STRING, s); }
    }
  }
  return s; // 问题：EOF 返回 string
}
```

- 修改后（示意）：

```ts
static makeString(iterator: PeekIterator) {
  let state = 0;
  let s = "";
  while (iterator.hasNext()) {
    const char = iterator.next();
    switch (state) {
      case 0: {
        if (char === '"') state = 1; else if (char === "'") state = 2;
        s += char; break;
      }
      case 1: { s += char; if (char !== '"') continue; return new Token(TokenType.STRING, s); }
      case 2: { s += char; if (char !== "'") continue; return new Token(TokenType.STRING, s); }
    }
  }
  // EOF：未闭合字符串，抛错而非返回 string
  throw new Error(`Syntax Error: unterminated string ${s}`);
}
```

- 预期效果：所有字符串分支要么返回 `Token(TokenType.STRING, s)`，要么抛错，不再有 `string` 泄漏到 `tokens`。

## 3.2. **修正 makeNumber：EOF 合法结束返回 Token，不完整立即抛错**

- 实施步骤：
  - 在循环自然结束（EOF）后，按已读内容判定是否为合法数字；合法则返回 `Token(NUMBER, s)`；不合法（如仅符号、以点结尾）则抛错。
  - 保持现有“遇到非数字时回退并返回数字”的早退逻辑不变。

- 修改前（简化示例）：

```ts
static makeNumber(iterator: PeekIterator) {
  let state = 0; let s = "";
  while (iterator.hasNext()) {
    const char = iterator.next();
    // ... 状态转移省略
  }
  return s; // 问题：EOF 返回 string
}
```

- 修改后（示意，末尾收尾逻辑）：

```ts
static makeNumber(iterator: PeekIterator) {
  let state = 0; let s = "";
  while (iterator.hasNext()) {
    const char = iterator.next();
    // ... 保持原状态机与早退逻辑
  }
  // EOF：根据已读内容判断是否合法数字
  const isValidNumber = /^[+-]?\d+(\.\d+)?$/.test(s);
  if (isValidNumber) return new Token(TokenType.NUMBER, s);
  throw new Error(`Syntax Error: incomplete number ${s}`);
}
```

- 说明：使用正则仅在 EOF 收尾阶段判断完整性，不改变过程中已有的回退与早退行为，改动面小且语义直观。

## 3.3. **修正 makeOperator：EOF 也返回 Token 或抛错**

- 实施步骤：
  - 在循环结束后：若 `s` 非空，返回 `Token(TokenType.OPERATOR, s)`；否则抛错。
  - 保持现有对多字符操作符（如 `>=`、`==`、`&&`）的早退返回逻辑不变。

- 修改后（收尾示意）：

```ts
// 循环结束
if (s.length > 0) return new Token(TokenType.OPERATOR, s);
throw new Error(`Syntax Error: bad operator`);
```

## 3.4. **配套调整与测试**

- `Lexer.parse`：无需逻辑变更，但其 `tokens` 的静态类型与语义将稳定为 `Token[]`。
- 单元测试补充：
  - 数字在 EOF：`"123"`、`"0"`、`"0.5"` 应返回 `Token(NUMBER, ...)`。
  - 不完整数字：`"+"`、`"-"`、`"0."` 在 EOF 应抛错。
  - 字符串未闭合：`'abc`、`"abc` 在 EOF 应抛错。
  - 操作符在 EOF：`"a+"` 应返回 `"+"` 的 `Token`；非法组合抛错。

# 4. 回归范围

从业务行为角度，重点回归“词法阶段的端到端输入到 `Token[]` 输出”的完整流程，关注 EOF 边界与异常字面量的处理一致性。

## 4.1. 主链路

- 输入源包含：变量、数字、字符串、操作符与括号的常见组合。
- 关键检查点：
  - `Lexer.parse` 输出仅包含 `Token`，不存在 `string` 元素。
  - 合法末尾数字与操作符在 EOF 处仍能正确产出 `Token`。
  - 语法非法的字面量在词法阶段明确抛错，错误信息包含上下文（如未闭合字符串的前缀）。
- 例用例：
  - 用例 A：`a 123 b` -> `[VAR(a), NUM(123), VAR(b)]`。
  - 用例 B：`IF(x)` -> `[KEYWORD(IF), BRACKET(() , VAR(x), BRACKET())]`。
  - 用例 C：`"hi" 'ok'` -> 两个 `STRING` Token。

## 4.2. 边界情况

- EOF 边界：
  - `"123"`、`"0"`、`"0.5"` -> 合法数字 Token。
  - `"+"`、`"-"`、`"0."` -> 抛错 `Syntax Error: incomplete number`。
- 字符串未闭合：
  - `"abc`、`'abc` -> 抛错 `Syntax Error: unterminated string`。
- 操作符结尾：
  - `"a+"` -> 末尾 `+` 仍为 `Token(OPERATOR, "+")`；对于无法构成合法操作符的序列抛错。

以上改动确保“词法 -> 语法”的层次边界更加清晰，所有不合法输入都在词法阶段显式暴露，降低后续环节的复杂度与风险。