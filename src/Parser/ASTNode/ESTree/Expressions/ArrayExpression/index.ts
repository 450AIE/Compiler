import Expression from "../Expression";
import { ASTNodeProps } from "../../NodeObjects/Node";
import Token from "../../../../../Lexer/Token";
import { ASTNODE_TYPE } from "../../../../consts";
import PeekTokenIterator from "../../../../PeekTokenIterator";

class ArrayExpression extends Expression {
  constructor({ label, type }: ASTNodeProps) {
    super({
      type: type ?? ASTNODE_TYPE.ARRAY_EXPRESSION,
      label,
    });
  }
  /**
   * const a = [   ] ----- 是数组
   * a[0]  ----- 不是数组  --- 在Statement的时候就会通过lookahead和token判断出来这个情况，所以走到这个地方的话，可以肯定不是这个情况
   * [...a] ----- 是数组
   * 对于数组来说，前面不能是变量，即a，否则是数组
   */
  static parse(iterator: PeekTokenIterator) {
    const arrayExpression = new ArrayExpression({ label: null });
    iterator.nextTokenMatchByValue("[");
    // 数组内部的每个元素都是Expression表达式,都可以用Expression.parse来解析
    let token: Token, expression: Expression;
    while (iterator.hasNext()) {
      token = iterator.peek() as Token;
      if (token?.getValue() === "]") break;
      expression = Expression.parse(iterator);
      token = iterator.peek() as Token;
      arrayExpression.addChild(expression);
      // 如果下一个token是]就break，避免下面误吃下面的，
      if (token?.getValue() === "]") break;
      iterator.nextTokenMatchByValue(",");
    }
    iterator.nextTokenMatchByValue("]");
    return arrayExpression;
  }
}

export default ArrayExpression;
