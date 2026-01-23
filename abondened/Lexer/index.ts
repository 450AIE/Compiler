// @ts-nocheck
import AlphabetChecker from "../AlphabetChecker";
import PeekIterator from "../PeekIterator";
import Token, { TokenType } from "../Token";

/**
 * 词法分析器
 */
class Lexer {
  analyze(source) {
    const tokens: Token[] = [];
    const iterator = new PeekIterator(source, "\0");
    while (iterator.hasNext()) {
      const char = iterator.next();
      // 遇到结束符，break
      if (char === "\0") break;
      const lookahead = iterator.peek();
      // 忽略空格和换行符
      if ([" ", "\n"].includes(char)) continue;
      // 处理括号
      if (["(", ")", "{", "}", "[", "]"].includes(char)) {
        tokens.push(new Token(TokenType.BRACKET, char));
        continue;
      }
      /**
       * 以下处理的时候都要putBack是因为内部makeXXX函数也要使用该next吞掉的第一个字符，所以要
       * putBack一下，确保makeXXX函数可以读取这第一个字符
       */
      // 处理字符串
      if (['"', "'"].includes(char)) {
        iterator.putBack();
        tokens.push(Token.makeString(iterator));
        continue;
      }
      // 处理变量或关键字
      if (AlphabetChecker.isLetter(char)) {
        iterator.putBack();
        tokens.push(Token.makeVarOrKeyword(iterator));
        continue;
      }
      // 处理含有+或-前缀的数字
      if (["-", "+"].includes(char) && AlphabetChecker.isNumber(lookahead)) {
        const lastToken = tokens[tokens.length - 1];
        // 只有前一个token不是数字，才会是一个新的数字，如果前一个token是数字，那么可能就是 5 + 5这种，如果前一个token不是数字,
        // 那么可能就是 a + +5 这种，这个前缀表示正负号
        if (lastToken == null || !lastToken.isNumber()) {
          iterator.putBack();
          tokens.push(Token.makeNumber(iterator));
          continue;
        }
      }
      // 处理运算符
      if (AlphabetChecker.isOperator(char)) {
        iterator.putBack();
        tokens.push(Token.makeOperator(iterator));
        continue;
      }
      throw new LexerError(`Unknown token: ${char}`);
    }
    return tokens;
  }
}

export default Lexer;
