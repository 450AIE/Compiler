import { describe, expect, it } from "vitest";
import PeekIterator from "../../PeekIterator";
import { KEYWORD_TYPE, TokenType } from "../../consts";
import Token from "../index";

describe("Token.makeNumber", () => {
  it("可以解析整数，并保留分隔符不被消费", () => {
    const iterator = new PeekIterator("123 ");
    const result = Token.makeNumber(iterator);
    expect(result).toBeInstanceOf(Token);
    const token = result as Token;
    expect(token.type).toBe(TokenType.NUMBER);
    expect(token.value).toBe("123");
    expect(token.loc).toEqual({
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 3, index: 3 },
    });
    expect(iterator.peek()).toEqual({
      value: " ",
      loc: {
        start: { line: 1, column: 3, index: 3 },
        end: { line: 1, column: 4, index: 4 },
      },
    });
  });

  it("可以解析带负号的整数", () => {
    const iterator = new PeekIterator("-5;");
    const result = Token.makeNumber(iterator);
    expect(result).toBeInstanceOf(Token);
    const token = result as Token;
    expect(token.type).toBe(TokenType.NUMBER);
    expect(token.value).toBe("-5");
    expect(token.loc).toEqual({
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 2, index: 2 },
    });
    expect(iterator.peek()).toEqual({
      value: ";",
      loc: {
        start: { line: 1, column: 2, index: 2 },
        end: { line: 1, column: 3, index: 3 },
      },
    });
  });

  it("可以解析带正号的整数", () => {
    const iterator = new PeekIterator("+6+");
    const result = Token.makeNumber(iterator);
    expect(result).toBeInstanceOf(Token);
    const token = result as Token;
    expect(token.type).toBe(TokenType.NUMBER);
    expect(token.value).toBe("+6");
    expect(token.loc).toEqual({
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 2, index: 2 },
    });
    expect(iterator.peek()).toEqual({
      value: "+",
      loc: {
        start: { line: 1, column: 2, index: 2 },
        end: { line: 1, column: 3, index: 3 },
      },
    });
  });

  it("可以解析小数", () => {
    const iterator = new PeekIterator("0.5 ");
    const result = Token.makeNumber(iterator);
    expect(result).toBeInstanceOf(Token);
    const token = result as Token;
    expect(token.type).toBe(TokenType.NUMBER);
    expect(token.value).toBe("0.5");
    expect(token.loc).toEqual({
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 3, index: 3 },
    });
    expect(iterator.peek()).toEqual({
      value: " ",
      loc: {
        start: { line: 1, column: 3, index: 3 },
        end: { line: 1, column: 4, index: 4 },
      },
    });
  });

  it("可以解析非零整数部分的小数", () => {
    const iterator = new PeekIterator("12.34)");
    const result = Token.makeNumber(iterator);
    expect(result).toBeInstanceOf(Token);
    const token = result as Token;
    expect(token.type).toBe(TokenType.NUMBER);
    expect(token.value).toBe("12.34");
    expect(token.loc).toEqual({
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 5, index: 5 },
    });
    expect(iterator.peek()).toEqual({
      value: ")",
      loc: {
        start: { line: 1, column: 5, index: 5 },
        end: { line: 1, column: 6, index: 6 },
      },
    });
  });

  it("前导 0 的非法整数会抛错", () => {
    const iterator = new PeekIterator("00 ");
    expect(() => Token.makeNumber(iterator)).toThrowError();
  });

  it("重复的小数点会抛错", () => {
    const iterator = new PeekIterator("1..2 ");
    expect(() => Token.makeNumber(iterator)).toThrowError();
  });
});

describe("Token.makeString", () => {
  it("可以解析双引号字符串，并保留分隔符不被消费", () => {
    const iterator = new PeekIterator('"hi" ');
    const result = Token.makeString(iterator);
    expect(result).toBeInstanceOf(Token);
    const token = result as Token;
    expect(token.type).toBe(TokenType.STRING);
    expect(token.value).toBe('"hi"');
    expect(token.loc).toEqual({
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 4, index: 4 },
    });
    expect(iterator.peek()).toBe(" ");
  });

  it("可以解析单引号字符串，并保留分隔符不被消费", () => {
    const iterator = new PeekIterator("'hi';");
    const result = Token.makeString(iterator);
    expect(result).toBeInstanceOf(Token);
    const token = result as Token;
    expect(token.type).toBe(TokenType.STRING);
    expect(token.value).toBe("'hi'");
    expect(token.loc).toEqual({
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 4, index: 4 },
    });
    expect(iterator.peek()).toBe(";");
  });

  it("可以解析空字符串", () => {
    const iterator = new PeekIterator('""+');
    const result = Token.makeString(iterator);
    expect(result).toBeInstanceOf(Token);
    const token = result as Token;
    expect(token.type).toBe(TokenType.STRING);
    expect(token.value).toBe('""');
    expect(token.loc).toEqual({
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 2, index: 2 },
    });
    expect(iterator.peek()).toBe("+");
  });

  it("可以解析包含空格的字符串", () => {
    const iterator = new PeekIterator('"a b c")');
    const result = Token.makeString(iterator);
    expect(result).toBeInstanceOf(Token);
    const token = result as Token;
    expect(token.type).toBe(TokenType.STRING);
    expect(token.value).toBe('"a b c"');
    expect(token.loc).toEqual({
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 7, index: 7 },
    });
    expect(iterator.peek()).toBe(")");
  });
});

describe("Token.makeOperator", () => {
  it("可以解析单字符运算符并保留分隔符不被消费", () => {
    const iterator = new PeekIterator("*a");
    const result = Token.makeOperator(iterator);
    expect(result).toBeInstanceOf(Token);
    const token = result as Token;
    expect(token.type).toBe(TokenType.OPERATOR);
    expect(token.value).toBe("*");
    expect(token.loc).toEqual({
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 1, index: 1 },
    });
    expect(iterator.peek()).toEqual({
      value: "a",
      loc: {
        start: { line: 1, column: 1, index: 1 },
        end: { line: 1, column: 2, index: 2 },
      },
    });
  });

  it("可以解析带等号的双字符运算符", () => {
    const iterator = new PeekIterator(">=x");
    const result = Token.makeOperator(iterator);
    expect(result).toBeInstanceOf(Token);
    const token = result as Token;
    expect(token.type).toBe(TokenType.OPERATOR);
    expect(token.value).toBe(">=");
    expect(token.loc).toEqual({
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 2, index: 2 },
    });
    expect(iterator.peek()).toBe("x");
  });

  it("可以解析等号比较运算符", () => {
    const iterator = new PeekIterator("==b");
    const result = Token.makeOperator(iterator);
    expect(result).toBeInstanceOf(Token);
    const token = result as Token;
    expect(token.type).toBe(TokenType.OPERATOR);
    expect(token.value).toBe("==");
    expect(token.loc).toEqual({
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 2, index: 2 },
    });
    expect(iterator.peek()).toBe("b");
  });

  it("可以解析自增运算符", () => {
    const iterator = new PeekIterator("++c");
    const result = Token.makeOperator(iterator);
    expect(result).toBeInstanceOf(Token);
    const token = result as Token;
    expect(token.type).toBe(TokenType.OPERATOR);
    expect(token.value).toBe("++");
    expect(token.loc).toEqual({
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 2, index: 2 },
    });
    expect(iterator.peek()).toBe("c");
  });
});

describe("Token.makeVariableOrKeyword", () => {
  it("可以解析单字符变量名，并保留分隔符不被消费", () => {
    const iterator = new PeekIterator("a ");
    const result = Token.makeVariableOrKeyword(iterator);
    expect(result).toBeInstanceOf(Token);
    const token = result as Token;
    expect(token.type).toBe(TokenType.VARIABLE);
    expect(token.value).toBe("a");
    expect(token.loc).toEqual({
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 1, index: 1 },
    });
    expect(iterator.peek()).toEqual({
      value: " ",
      loc: {
        start: { line: 1, column: 1, index: 1 },
        end: { line: 1, column: 2, index: 2 },
      },
    });
  });

  it("可以解析多字符变量名", () => {
    const iterator = new PeekIterator("abc a");
    const result = Token.makeVariableOrKeyword(iterator);
    expect(result).toBeInstanceOf(Token);
    const token = result as Token;
    expect(token.type).toBe(TokenType.VARIABLE);
    expect(token.value).toBe("abc");
    expect(token.loc).toEqual({
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 3, index: 3 },
    });
    expect(iterator.peek()).toEqual({
      value: " ",
      loc: {
        start: { line: 1, column: 3, index: 3 },
        end: { line: 1, column: 4, index: 4 },
      },
    });
  });

  it("可以解析包含下划线与数字的变量名", () => {
    const iterator = new PeekIterator("_a1+");
    const result = Token.makeVariableOrKeyword(iterator);
    expect(result).toBeInstanceOf(Token);
    const token = result as Token;
    expect(token.type).toBe(TokenType.VARIABLE);
    expect(token.value).toBe("_a1");
    expect(token.loc).toEqual({
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 3, index: 3 },
    });
    expect(iterator.peek()).toEqual({
      value: "+",
      loc: {
        start: { line: 1, column: 3, index: 3 },
        end: { line: 1, column: 4, index: 4 },
      },
    });
  });

  it("可以识别关键字", () => {
    const iterator = new PeekIterator("if(x)");
    const result = Token.makeVariableOrKeyword(iterator);
    expect(result).toBeInstanceOf(Token);
    const token = result as Token;
    expect(token.type).toBe(TokenType.KEYWORD);
    expect(token.value).toBe(KEYWORD_TYPE.IF);
    expect(token.loc).toEqual({
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 2, index: 2 },
    });
    expect(iterator.peek()).toEqual({
      value: "(",
      loc: {
        start: { line: 1, column: 2, index: 2 },
        end: { line: 1, column: 3, index: 3 },
      },
    });
  });

  it("首字符不合法会抛错", () => {
    const iterator = new PeekIterator("1a");
    expect(() => Token.makeVariableOrKeyword(iterator)).toThrowError();
  });
});
