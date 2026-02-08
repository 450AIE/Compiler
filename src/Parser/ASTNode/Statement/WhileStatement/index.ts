import ASTNode, { ASTNodeProps } from "../..";
import { KEYWORD_TYPE, TokenType } from "../../../../Lexer/consts";
import PeekTokenIterator from "../../../PeekTokenIterator";
import { ASTNODE_TYPE } from "../../../consts";
import Expression from "../../Expression";
import BlockStatement from "../BlockStatement";

class WhileStatement extends ASTNode {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.WHILE_STATEMENT,
      label,
    });
  }
  /**
   * while(Expression) Block
   */
  static parse(iterator: PeekTokenIterator) {
    const whileStatement = new WhileStatement({ label: null });
    const keyword = iterator.nextTokenMatchByValue(KEYWORD_TYPE.WHILE);
    iterator.nextTokenMatchByValue("(");
    const expression = Expression.parse(iterator);
    iterator.nextTokenMatchByValue(")");
    const block = BlockStatement.parse(iterator);
    whileStatement.lexme = keyword;
    whileStatement.addChild(expression);
    whileStatement.addChild(block);
    return whileStatement;
  }
}

export default WhileStatement;
