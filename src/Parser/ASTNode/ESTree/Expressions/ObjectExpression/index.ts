import Expression from "../Expression";
import { ASTNodeProps } from "../../NodeObjects/Node";
import Token from "../../../../../Lexer/Token";
import { ASTNODE_TYPE } from "../../../../consts";
import PeekTokenIterator from "../../../../PeekTokenIterator";
import Factor from "../../NodeObjects/Factor";

class ObjectExpression extends Expression {
  constructor({ label, type }: ASTNodeProps) {
    super({
      type: type ?? ASTNODE_TYPE.OBJECT_EXPRESSION,
      label,
    });
  }
  /**
   * 暂时只考虑
   * { key : value }  这种写清楚了的情况，即 {  Factor : Expression  }
   */
  static parse(iterator: PeekTokenIterator) {
    const objectExpression = new ObjectExpression({ label: null });
    iterator.nextTokenMatchByValue("{");
    let token: Token, key: ReturnType<typeof Factor.parse>, expression: Expression;
    while (iterator.hasNext()) {
      token = iterator.peek() as Token;
      if (token?.getValue() === "}") break;
      key = Factor.parse(iterator);
      iterator.nextTokenMatchByValue(":");
      expression = Expression.parse(iterator);
      objectExpression.addChild(key);
      objectExpression.addChild(expression);
      token = iterator.peek() as Token;
      if (token?.getValue() === "}") break;
      iterator.nextTokenMatchByValue(",");
    }
    iterator.nextTokenMatchByValue("}");
    return objectExpression;
  }
}

export default ObjectExpression;
