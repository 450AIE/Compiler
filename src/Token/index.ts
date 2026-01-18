import AlphabetChecker from "../AlphabetChecker";
import KEY_WORDS from "../consts";
import LexerError from "../Error/LexerError";
import PeekIterator from "../PeekIterator";

export const TokenType = {
  LETTER: "LETTER",
  NUMBER: "NUMBER",
  BOOLEAN: "BOOLEAN",
  NULL: "NULL",
  UNDEFINED: "UNDEFINED",
  STRING: "STRING",
  LITERAL: "LITERAL",
  OPERATOR: "OPERATOR",
  KEY_WORD: "KEY_WORD",
  VARIABLE: "VARIABLE",
  BRACKET: "BRACKET",
} as const;

export type TokenType = (typeof TokenType)[keyof typeof TokenType];

/**
 * 词法分析器生成的Token
 */
class Token {
  _type: TokenType;
  _value: string;
  constructor(type: TokenType, value: string) {
    this._type = type;
    this._value = value;
  }
  getType() {
    return this._type;
  }
  getValue() {
    return this._value;
  }
  isLetter() {
    return this._type === TokenType.LETTER;
  }
  isNumber() {
    return this._type === TokenType.NUMBER;
  }
  isLiteral() {
    return this._type === TokenType.LITERAL;
  }
  isOperator() {
    return this._type === TokenType.OPERATOR;
  }
  /**
   * 下面解析的前提是，已经确定it接下来识别的都是对应的makeXXXXX类型
   */
  // 读取字符，解析为变量或关键字
  static makeVarOrKeyword(iterator: PeekIterator) {
    let s = "";
    while (iterator.hasNext()) {
      // 这里是peek而不是next，因为next会消费掉字符，如果发现不是字母或数字的话，下次读取这个被消费的字符就需要
      // 从queueCache中取，但是没有提供从queueCache中取的方法，所以这里只能用peek
      const char = iterator.peek();
      if (AlphabetChecker.isLiteral(iterator.peek())) {
        s += char;
      } else {
        break;
      }
      iterator.next();
    }
    // 检查是否是关键字
    if (KEY_WORDS[s]) {
      return new Token(TokenType.KEY_WORD, s);
    }
    // @ts-ignore
    if (["true", "false"].includes(s)) {
      return new Token(TokenType.BOOLEAN, s);
    }
    // 其他情况都是变量
    return new Token(TokenType.VARIABLE, s);
  }
  // 读取字符，解析为字符串
  static makeString(iterator: PeekIterator) {
    let s = "";
    // 0 表示初始状态，1 表示读取到的第一个是双引号，2 表示读取到的第一个是单引号
    let state = 0;
    while (iterator.hasNext()) {
      let char = iterator.next();
      switch (state) {
        case 0: {
          if (char === '"') {
            state = 1;
          } else if (char === "'") {
            state = 2;
          }
          s += char;
          break;
        }
        case 1: {
          // 1 表示读取到的第一个是双引号，所以后续遇到双引号就表示字符串结束
          if (char === '"') {
            return new Token(TokenType.STRING, s);
          } else {
            s += char;
          }
          break;
        }
        case 2: {
          // 2 表示读取到的第一个是单引号，所以后续遇到单引号就表示字符串结束
          if (char === "'") {
            return new Token(TokenType.STRING, s);
          } else {
            s += char;
          }
          break;
        }
      }
    }
    // 循环结束了，说明字符流读完了还没有结束符，抛出异常
    throw new LexerError(`字符串没有结束符`);
  }
  static makeOperator(iterator: PeekIterator) {
    let state = 0;
    while (iterator.hasNext()) {
      const char = iterator.next();
      switch (state) {
        case 0: {
          switch (char) {
            case "+":
              state = 1;
              break;
            case "-":
              state = 2;
              break;
            case "*":
              state = 3;
              break;
            case "/":
              state = 4;
              break;
            case ">":
              state = 5;
              break;
            case "<":
              state = 6;
              break;
            case "=":
              state = 7;
              break;
            case "!":
              state = 8;
              break;
            case "&":
              state = 9;
              break;
            case "|":
              state = 10;
              break;
            case "^":
              state = 11;
              break;
            case "%":
              state = 12;
              break;
            case ",":
              return new Token(TokenType.OPERATOR, char);
            case ";":
              return new Token(TokenType.OPERATOR, char);
            default:
              throw new LexerError(`未知的运算符${char}`);
          }
          break;
        }
        case 1: {
          if (char === "+") {
            return new Token(TokenType.OPERATOR, "++");
          } else if (char === "=") {
            return new Token(TokenType.OPERATOR, "+=");
          } else {
            // 这个字符不能和+搭配，多吃了，需要回退
            iterator.putBack();
            return new Token(TokenType.OPERATOR, "+");
          }
        }
        case 2: {
          if (char === "-") {
            return new Token(TokenType.OPERATOR, "--");
          } else if (char === "=") {
            return new Token(TokenType.OPERATOR, "-=");
          } else {
            iterator.putBack();
            return new Token(TokenType.OPERATOR, "-");
          }
        }
        case 3: {
          if (char === "=") {
            return new Token(TokenType.OPERATOR, "*=");
          } else {
            iterator.putBack();
            return new Token(TokenType.OPERATOR, "*");
          }
        }
        case 4: {
          if (char === "=") {
            return new Token(TokenType.OPERATOR, "/=");
          } else {
            iterator.putBack();
            return new Token(TokenType.OPERATOR, "/");
          }
        }
        case 5: {
          if (char === "=") {
            return new Token(TokenType.OPERATOR, ">=");
          } else {
            iterator.putBack();
            return new Token(TokenType.OPERATOR, ">");
          }
        }
        case 6: {
          if (char === "=") {
            return new Token(TokenType.OPERATOR, "<=");
          } else {
            iterator.putBack();
            return new Token(TokenType.OPERATOR, "<");
          }
        }
        case 7: {
          if (char === "=") {
            return new Token(TokenType.OPERATOR, "==");
          } else {
            iterator.putBack();
            return new Token(TokenType.OPERATOR, "=");
          }
        }
        case 8: {
          if (char === "=") {
            return new Token(TokenType.OPERATOR, "!=");
          } else {
            iterator.putBack();
            return new Token(TokenType.OPERATOR, "!");
          }
        }
        case 9: {
          if (char === "&") {
            return new Token(TokenType.OPERATOR, "&&");
          } else if (char === "=") {
            return new Token(TokenType.OPERATOR, "&=");
          } else {
            iterator.putBack();
            return new Token(TokenType.OPERATOR, "&");
          }
        }
        case 10: {
          if (char === "|") {
            return new Token(TokenType.OPERATOR, "||");
          } else if (char === "=") {
            return new Token(TokenType.OPERATOR, "|=");
          } else {
            iterator.putBack();
            return new Token(TokenType.OPERATOR, "|");
          }
        }
        case 11: {
          if (char === "=") {
            return new Token(TokenType.OPERATOR, "^=");
          } else {
            iterator.putBack();
            return new Token(TokenType.OPERATOR, "^");
          }
        }
        case 12: {
          if (char === "=") {
            return new Token(TokenType.OPERATOR, "%=");
          } else {
            iterator.putBack();
            return new Token(TokenType.OPERATOR, "%");
          }
        }
      }
    }
    // 循环结束了，说明字符流读完了还没有结束符，抛出异常
    throw new LexerError(`未知异常`);
  }
  static makeNumber(iterator: PeekIterator) {
    let s = "";
    let state = 0;
    while (iterator.hasNext()) {
      const char = iterator.next();
      switch (state) {
        case 0: {
          if (char === "0") {
            state = 1;
          } else if (AlphabetChecker.isNumber(char)) {
            state = 2;
            // @ts-ignore
          } else if (["-", "+"].includes(char)) {
            state = 3;
          } else {
            throw new LexerError(`未知异常`);
          }
          s += char;
          break;
        }
        case 1: {
          if (char === ".") {
            state = 4;
            s += char;
            break;
          }
          // 0后面只能是小数点，不是的话，说明是一个单独的0，要把读取的这个char回退
          iterator.putBack();
          return new Token(TokenType.NUMBER, s);
        }
        case 2: {
          if (AlphabetChecker.isNumber(char)) {
            s += char;
            break;
          } else if (char === ".") {
            state = 4;
            s += char;
            break;
          }
          iterator.putBack();
          return new Token(TokenType.NUMBER, s);
        }
        case 3: {
          if (AlphabetChecker.isNumber(char)) {
            state = 2;
            s += char;
            break;
          }
          throw new LexerError(`未知异常`);
        }
        case 4: {
          if (AlphabetChecker.isNumber(char)) {
            s += char;
            break;
          } else {
            // 小数点后面不能是其他字符，多吃了，需要回退
            iterator.putBack();
            return new Token(TokenType.NUMBER, s);
          }
        }
        // 下面的状态很好理解了
        case 5: {
          if (AlphabetChecker.isNumber(char)) {
            s += char;
            break;
          }
          iterator.putBack();
          return new Token(TokenType.NUMBER, s);
        }
      }
    }
    throw new LexerError(`未知异常`);
  }
}

export default Token;
