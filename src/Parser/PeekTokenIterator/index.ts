import { KEYWORD_TYPE, OPERATOR_TYPE, TokenType } from "../../Lexer/consts";
import PeekIterator from "../../Lexer/PeekIterator";
import Token from "../../Lexer/Token";

/**
 * 便利Token数组的迭代器
 */
class PeekTokenIterator extends PeekIterator<Token> {
  constructor(tokens: Token[]) {
    super(tokens);
  }
  // 预期吃掉下一个值为Value的Token
  nextTokenMatchByValue(value: string) {
    const token = this.next();
    if (token === TokenType.EOF) {
      throw new Error("Unexpected Error EOF");
    }
    if (token.getValue() !== value) {
      throw new Error(`Unexpected Error: TokenType not equal ---> ${token.getValue()} and ${value}`);
    }
    return token;
  }
  // 预期吃掉下一个类型为Type的Token
  nextTokenMatchByType(type: TokenType) {
    const token = this.next();
    if (token === TokenType.EOF) {
      throw new Error("Unexpected Error EOF");
    }
    if (token.getType() !== type) {
      throw new Error(`Unexpected Error: TokenType not equal ---> ${token.getType()} and ${type}`);
    }
    return token;
  }
}

export default PeekTokenIterator;
