import AlphabetChecker from "../AlphabetChecker";
import { KEYWORD_TYPE, TokenType } from "../consts";
import PeekIterator from "../PeekIterator";

class Token {
  public type: TokenType;
  public value: string;
  constructor(type: TokenType, value: string) {
    this.type = type;
    this.value = value;
  }
  getType() {
    return this.type;
  }
  getValue() {
    return this.value;
  }
  static isScalar(type: TokenType) {
    // @ts-expect-error
    return [TokenType.NUMBER, TokenType.STRING, TokenType.BOOLEAN, TokenType.NULL].includes(type);
  }
  /**
   * 以下的makeXXX方法都是接收迭代器，然后进行往后面进行迭代读取字符解析为XXX。
   * 前提条件：如果调用makeXXX，那么接下来的字符串必须就是XXX类型的，所以需要Lexer外部进行
   * 判断第一个字符再确定后再进入makeXXX函数调用
   */
  static makeString(iterator: PeekIterator) {
    let state = 0;
    let s = "";
    while (iterator.hasNext()) {
      const char = iterator.next();
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
          s += char;
          if (char !== '"') continue;
          return new Token(TokenType.STRING, s);
        }
        case 2: {
          s += char;
          if (char !== "'") continue;
          return new Token(TokenType.STRING, s);
        }
      }
    }
    return s;
  }
  static makeNumber(iterator: PeekIterator) {
    let state = 0;
    let s = "";
    while (iterator.hasNext()) {
      const char = iterator.next();
      switch (state) {
        case 0: {
          if (["-", "+"].includes(char)) {
            state = 3;
          } else if (char === "0") {
            state = 1;
          } else if (AlphabetChecker.isNumber(char)) {
            state = 2;
          }
          s += char;
          break;
        }
        case 1: {
          if (char !== ".") throw new Error(`Unexpected token ${char}`);
          s += char;
          state = 4;
          break;
        }
        case 2: {
          if (char === ".") {
            state = 4;
          } else if (AlphabetChecker.isNumber(char)) {
            state = 2;
          } else {
            // 发现这次吃的这个char不是数字，说明之前吃的全部字符可以凑成一个数字，但是这个不是，所以要要放回去
            iterator.putBack();
            return new Token(TokenType.NUMBER, s);
          }
          s += char;
          break;
        }
        case 3: {
          if (!AlphabetChecker.isNumber(char)) {
            throw new Error(`Unexpected token ${char}`);
          }
          state = 2;
          s += char;
          break;
        }
        case 4: {
          if (char === ".") {
            throw new Error(`Unexpected token ${char}`);
          } else if (AlphabetChecker.isNumber(char)) {
            s += char;
            state = 5;
            continue;
          }
          // 发现这次吃的这个char不是数字，说明之前吃的全部字符可以凑成一个数字，但是这个不是，所以要要放回去
          iterator.putBack();
          return new Token(TokenType.NUMBER, s);
        }
        case 5: {
          if (AlphabetChecker.isNumber(char)) {
            state = 5;
            s += char;
            continue;
          } else if (char === ".") {
            throw new Error(`Unexpected token ${char}`);
          }
          // 发现这次吃的这个char不是数字，说明之前吃的全部字符可以凑成一个数字，但是这个不是，所以要要放回去
          iterator.putBack();
          return new Token(TokenType.NUMBER, s);
        }
      }
    }
    return s;
  }
  static makeOperator(iterator: PeekIterator) {
    let state = 0;
    let s = "";
    while (iterator.hasNext()) {
      const char = iterator.next();
      switch (state) {
        case 0: {
          // if ([",", ";"].includes(char)) return new Token(TokenType.OPERATOR, char);
          switch (char) {
            case "+": {
              state = 1;
              break;
            }
            case "-": {
              state = 1;
              break;
            }
            case "*": {
              state = 1;
              break;
            }
            case "/": {
              state = 1;
              break;
            }
            case ">": {
              state = 1;
              break;
            }
            case "<": {
              state = 1;
              break;
            }
            case "=": {
              state = 1;
              break;
            }
            case "!": {
              state = 1;
              break;
            }
            case "&": {
              state = 1;
              break;
            }
            case "|": {
              state = 1;
              break;
            }
            case "^": {
              state = 1;
              break;
            }
            case "%": {
              state = 1;
              break;
            }
          }
          s += char;
          continue;
        }
        case 1: {
          if (["+", "="].includes(char)) {
            s += char;
          } else {
            iterator.putBack();
          }
          return new Token(TokenType.OPERATOR, s);
        }
        case 2: {
          if (["-", "="].includes(char)) {
            s += char;
          } else {
            iterator.putBack();
          }
          return new Token(TokenType.OPERATOR, s);
        }
        case 3: {
          if (char === "=") {
            s += char;
          } else {
            iterator.putBack();
          }
          return new Token(TokenType.OPERATOR, s);
        }
        case 4: {
          if (char === "=") {
            s += char;
          } else {
            iterator.putBack();
          }
          return new Token(TokenType.OPERATOR, s);
        }
        case 5: {
          if ([">", "="].includes(char)) {
            s += char;
          } else {
            iterator.putBack();
          }
          return new Token(TokenType.OPERATOR, s);
        }
        case 6: {
          if (["<", "="].includes(char)) {
            s += char;
          } else {
            iterator.putBack();
          }
          return new Token(TokenType.OPERATOR, s);
        }
        case 7: {
          if (char === "") {
            s += char;
          } else {
            iterator.putBack();
          }
          return new Token(TokenType.OPERATOR, s);
        }
        case 8: {
          if (char === "!") {
            s += char;
          } else {
            iterator.putBack();
          }
          return new Token(TokenType.OPERATOR, s);
        }
        case 9: {
          if (["&", "="].includes(char)) {
            s += char;
          }
          return new Token(TokenType.OPERATOR, s);
        }
        case 10: {
          if (["|", "="].includes(char)) {
            s += char;
          }
          return new Token(TokenType.OPERATOR, s);
        }
        case 11: {
          if (char === "^") {
            s += char;
          }
          return new Token(TokenType.OPERATOR, s);
        }
        case 12: {
          if (char === "%") {
            s += char;
          }
          return new Token(TokenType.OPERATOR, s);
        }
      }
      throw new Error(`Syntax Error: ${s} + ${char}`);
    }
    return s;
  }
  static makeVariableOrKeyword(iterator: PeekIterator) {
    let state = 0;
    let s = "";
    while (iterator.hasNext()) {
      const char = iterator.next();
      switch (state) {
        case 0: {
          if (AlphabetChecker.isIdentifierFirstCharRegExp(char)) {
            state = 1;
            s += char;
            continue;
          }
          throw new Error(`Unexpected token ${char}`);
        }
        case 1: {
          if (AlphabetChecker.isIdentifierNotFirstCharRegExp(char)) {
            state = 2;
            s += char;
            continue;
          }
          iterator.putBack();
          return new Token(TokenType.VARIABLE, s);
        }
        case 2: {
          if (AlphabetChecker.isIdentifierNotFirstCharRegExp(char)) {
            state = 2;
            s += char;
            continue;
          }
          iterator.putBack();
          // 遇到不是合法的标识符字符了，现在判断s是否是关键字，如果不是，就是变量
          if (KEYWORD_TYPE[s]) return new Token(TokenType.KEYWORD, s);
          return new Token(TokenType.VARIABLE, s);
        }
      }
    }
    throw new Error(`Syntax Error: ${s}`);
  }
}

export default Token;
