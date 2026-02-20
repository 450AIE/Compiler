import Expression from "../Expression";
import { ASTNodeProps } from "../../NodeObjects/Node";
import { ASTNODE_TYPE } from "../../../../consts";
import PeekTokenIterator from "../../../../PeekTokenIterator";

class TenaryExpression extends Expression {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.Tenary_Expression,
      label,
    });
  }
  /**
   * 三目运算符的格式是 Expression ? Expression : Expression
   */
  static parse(iterator: PeekTokenIterator) {
    const tenaryExpression = new TenaryExpression({ label: null });
    const condition = Expression.parse(iterator);
    iterator.nextTokenMatchByValue("?");
    const expression1 = Expression.parse(iterator);
    iterator.nextTokenMatchByValue(":");
    const expression2 = Expression.parse(iterator);
    tenaryExpression.addChild(condition);
    tenaryExpression.addChild(expression1);
    tenaryExpression.addChild(expression2);
    return tenaryExpression;
  }
}

export default TenaryExpression;
