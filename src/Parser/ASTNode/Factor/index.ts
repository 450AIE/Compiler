import ASTNode from "..";

import { ASTNodeProps } from "..";
import { TokenType } from "../../../Lexer/consts";
import Token from "../../../Lexer/Token";
import PeekTokenIterator from "../../PeekTokenIterator";
import Scalar from "./Scalar";
import Variable from "./Variable";

class Factor extends ASTNode {
  constructor({ type, label, lexme }: ASTNodeProps) {
    super({
      type,
      label,
      lexme,
    });
  }
  /**
   * 解析因子，解析他是变量还是标量（常量）
   */
  static parse(iterator: PeekTokenIterator) {
    const token = iterator.next() as Token;
    return Factor.parseToken(token);
  }
  static parseToken(token: Token) {
    const type = token.getType();
    if (type === TokenType.VARIABLE) {
      return new Variable({ lexme: token, label: null });
    } else if (Token.isScalar(type)) {
      return new Scalar({ lexme: token, label: null });
    }
    return null;
  }
}

export default Factor;
