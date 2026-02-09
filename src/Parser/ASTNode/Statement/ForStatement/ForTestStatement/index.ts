import ASTNode, { ASTNodeProps } from "../../..";
import Token from "../../../../../Lexer/Token";
import { ASTNODE_TYPE } from "../../../../consts";
import PeekTokenIterator from "../../../../PeekTokenIterator";
import Expression from "../../../Expression";

class ForTestStatement extends ASTNode {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.FOR_TEST_STATEMENT,
      label,
    });
  }
  /**
   * for( ForInit ; ForTest ; ForUpdate ) Block
   *
   * ForInit --- DeclareStatement | AssignStatement ｜ null
   * ForTest --- Expression ｜ null
   * ForUpdate ---  AssignStatement | 后续还可能是函数调用等等
   *
   */
  static parse(iterator: PeekTokenIterator) {
    const forTest = new ForTestStatement({ label: null });
    const token = iterator.peek() as Token;
    let child;
    if (token.getValue() === ";") {
      child = null;
    } else {
      child = Expression.parse(iterator);
    }
    forTest.addChild(child);
    return forTest;
  }
}

export default ForTestStatement;
