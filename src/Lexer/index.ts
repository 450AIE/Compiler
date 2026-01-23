import AlphabetChecker from "./AlphabetChecker";
import { TokenType } from "./consts";
import PeekIterator from "./PeekIterator";
import Token from "./Token";

class Lexer {
  static parse(codeSource: string) {
    const tokens = [];
    const iterator = new PeekIterator(codeSource);
    // 然后开始while循环到读取字符，进行Token拆分
    while (iterator.hasNext()) {
      /**
       * 理论上说，只需要看一个字符就可以知道该字符应该使用Token.makeXXX了，但是对于+5，-6这种带符号的数字，无法确定，
       * 于是需要向前阅读2个字符来确定是操作符还是带符号的数字，我这里不做，因为改动有点大
       */
      const char = iterator.peek();
      if (char === TokenType.EOF) break;
      // 空格，换行就略过，并且吃掉
      if ([" ", "\n"].includes(char)) {
        iterator.next();
        continue;
      }
      // 括号
      if (["(", ")", "[", "]", "{", "}"].includes(char)) {
        iterator.next();
        tokens.push(new Token(TokenType.BRACKET, char));
        // 是数字
      } else if (AlphabetChecker.isNumber(char)) {
        tokens.push(Token.makeNumber(iterator));
        // 是操作符
      } else if (AlphabetChecker.isOperator(char)) {
        tokens.push(Token.makeOperator(iterator));
        // 检查是否是单个字符
      } else if (AlphabetChecker.isLetter(char)) {
        tokens.push(Token.makeVariableOrKeyword(iterator));
      } else if (["'", '"'].includes(char)) {
        tokens.push(Token.makeString(iterator));
      } else {
        throw new Error(`Unknown token: ${char}`);
      }
    }
    return tokens;
  }
}

export default Lexer;
