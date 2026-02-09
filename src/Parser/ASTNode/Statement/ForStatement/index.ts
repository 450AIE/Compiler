import Statement from "..";
import ASTNode, { ASTNodeProps } from "../..";
import { KEYWORD_TYPE } from "../../../../Lexer/consts";
import { ASTNODE_TYPE } from "../../../consts";
import PeekTokenIterator from "../../../PeekTokenIterator";
import BlockStatement from "../BlockStatement";
import ForInitStatement from "./ForInitStatement";
import ForTestStatement from "./ForTestStatement";
import ForUpdateStatement from "./ForUpdateStatement";

class ForStatement extends ASTNode {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.FOR_STATEMENT,
      label,
    });
  }
  /**
   * for( ForInit ; ForTest ; ForUpdate ) Block
   *
   * ForInit --- DeclareStatement | AssignStatement ｜ null
   * ForTest --- Expression ｜ null
   * ForUpdate ---  AssignStatement | null ｜ 后续还可能是函数调用等等
   *
   */
  static parse(iterator: PeekTokenIterator) {
    const forStatement = new ForStatement({ label: null });
    const keyword = iterator.nextTokenMatchByValue(KEYWORD_TYPE.FOR);
    iterator.nextTokenMatchByValue("(");
    const forInit = ForInitStatement.parse(iterator);
    iterator.nextTokenMatchByValue(";");
    const forTest = ForTestStatement.parse(iterator);
    iterator.nextTokenMatchByValue(";");
    const forUpdate = ForUpdateStatement.parse(iterator);
    iterator.nextTokenMatchByValue(")");
    const block = BlockStatement.parse(iterator);
    forStatement.lexme = keyword;
    forStatement.addChild(forInit);
    forStatement.addChild(forTest);
    forStatement.addChild(forUpdate);
    forStatement.addChild(block);
    return forStatement;
  }
}

export default ForStatement;
