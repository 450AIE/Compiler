import ASTNode from "../..";
import { ASTNodeProps } from "../..";
import { ASTNODE_TYPE } from "../../../consts";
import PeekTokenIterator from "../../../PeekTokenIterator";
import Expression from "../../Expression";
import Factor from "../../Factor";

class AssignStatement extends ASTNode {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.ASSIGN_STATEMENT,
      label,
    });
  }
  /**
   * 一个赋值表达式的样式是 a = 1，所以是先解析Factor，再吃掉=，再解析Expression
   */
  static parse(iterator: PeekTokenIterator) {
    const assign = new AssignStatement({ label: null });
    const variabel = iterator.peek();
    //
    const factor = Factor.parse(iterator);
    if (!factor) throw new Error(`Unexpected Factor: ${variabel}`);
    assign.lexme = iterator.nextTokenMatchByValue("=");
    //
    const expression = Expression.parse(iterator);
    assign.addChild(factor);
    assign.addChild(expression);
    return assign;
  }
}

export default AssignStatement;
