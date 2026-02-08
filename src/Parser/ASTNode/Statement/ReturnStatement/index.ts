import ASTNode, { ASTNodeProps } from "../..";
import { KEYWORD_TYPE, TokenType } from "../../../../Lexer/consts";
import PeekTokenIterator from "../../../PeekTokenIterator";
import { ASTNODE_TYPE } from "../../../consts";
import Expression from "../../Expression";

class ReturnStatement extends ASTNode {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.RETURN_STATEMENT,
      label,
    });
  }
  /**
   * return Expression    or    return  +   }
   */
  static parse(iterator: PeekTokenIterator) {
    const ret = new ReturnStatement({ label: null });
    const keyword = iterator.nextTokenMatchByValue(KEYWORD_TYPE.RETURN);
    ret.lexme = keyword;
    const next = iterator.peek();
    if (next === TokenType.EOF) {
      throw new Error("Unexpected Error EOF");
    }
    // return后面是大括号，代表函数结束
    if ((next as any).getValue?.() === "}") {
      return ret;
    }
    const expr = Expression.parse(iterator);
    ret.addChild(expr);
    return ret;
  }
}

export default ReturnStatement;
