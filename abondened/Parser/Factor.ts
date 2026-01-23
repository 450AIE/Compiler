// @ts-nocheck
import Token, { TokenType } from "../Token";
import ASTNode from "./ASTNode";

import { ASTNODE_TYPE } from "./ASTNode";
import PeekTokenIterator from "./PeekTokenIterator";

class Factor extends ASTNode {
  constructor(token) {
    super();
    const type = token.getType();
    if (type === TokenType.VARIABLE) {
      this.type = ASTNODE_TYPE.VARIABLE;
    } else {
      this.type = ASTNODE_TYPE.SCALAR;
    }
    this.lexeme = token;
  }
  static parse(it) {
    const token = it.peek();
    const type = token.getType();
    if (type === TokenType.VARIABLE) {
      it.next();
      return new Variable({ parent: this, iterator: it });
    } else if (type === TokenType.SCALAR) {
      return new Scalar({ parent: this, iterator: it });
    }
    return null;
  }
}

export default Factor;
