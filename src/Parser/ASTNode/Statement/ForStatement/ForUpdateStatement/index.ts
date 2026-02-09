import ASTNode, { ASTNodeProps } from "../../..";
import { KEYWORD_TYPE, TokenType } from "../../../../../Lexer/consts";
import Token from "../../../../../Lexer/Token";
import { ASTNODE_TYPE } from "../../../../consts";
import PeekTokenIterator from "../../../../PeekTokenIterator";
import Expression from "../../../Expression";
import AssignStatement from "../../AssignStatement";

class ForUpdateStatement extends ASTNode {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.FOR_UPDATE_STATEMENT,
      label,
    });
  }
  /**
   * for( ForInit ; ForTest ; ForUpdate ) Block
   *
   * ForInit --- DeclareStatement | AssignStatement ｜ null
   * ForTest --- Expression ｜ null
   * ForUpdate ---  AssignStatement | null | 后续还可能是函数调用等等
   *
   */
  static parse(iterator: PeekTokenIterator) {
    const forUpdateStatement = new ForUpdateStatement({ label: null });
    const token = iterator.next() as Token;
    const lookahead = iterator.peek() as Token;
    const type = token.getType();
    const value = token.getValue();
    let child;
    if (type === TokenType.VARIABLE && lookahead?.getValue() === "=") {
      iterator.unget();
      child = AssignStatement.parse(iterator);
    } else if (value === ")") {
      iterator.unget();
      child = null;
      // expression的情况确实无法判断，之后放在else中了
    }
    forUpdateStatement.addChild(child);
    return forUpdateStatement;
  }
}

export default ForUpdateStatement;
