import { ASTNodeProps } from "../../NodeObjects/Node";
import { ASTNODE_TYPE } from "../../../../consts";
import PeekTokenIterator from "../../../../PeekTokenIterator";
import Expression from "../Expression";
import Factor from "../../NodeObjects/Factor";
import Token from "../../../../../Lexer/Token";

class AssignExpression extends Expression {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.ASSIGN_EXPRESSION,
      label,
    });
  }
  /**
   * 一个赋值表达式的样式是 a = 1，所以是先解析Factor，再吃掉=，再解析Expression
   */
  static parse(iterator: PeekTokenIterator) {
    const assign = new AssignExpression({ label: null });
    const variabel = iterator.peek();
    //
    const factor = Factor.parse(iterator);
    if (!factor) throw new Error(`Unexpected Factor: ${variabel}`);
    assign.lexme = iterator.nextTokenMatchByValue("=") as Token;
    //
    const expression = Expression.parse(iterator);
    assign.addChild(factor);
    assign.addChild(expression);
    return assign;
  }
}

export default AssignExpression;
