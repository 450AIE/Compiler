import ASTNode, { ASTNodeProps } from "../../..";
import { TokenType } from "../../../../../Lexer/consts";
import PeekIterator from "../../../../../Lexer/PeekIterator";
import Token from "../../../../../Lexer/Token";
import { ASTNODE_TYPE } from "../../../../consts";
import PeekTokenIterator from "../../../../PeekTokenIterator";
import Factor from "../../../Factor";

class FunctionArgsStatement extends ASTNode {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.FUNCTION_ARGS_STATEMENT,
      label,
    });
  }
  /**
   * variable1 , variable2 , .....
   */
  static parse(iterator: PeekTokenIterator) {
    const functionArgs = new FunctionArgsStatement({ label: null });
    const token = iterator.peek() as Token;
    // 可能是空参数，即function foo()，
    if (token.getValue() === ")") return functionArgs;
    while (iterator.hasNext()) {
      const factor = Factor.parse(iterator);
      functionArgs.addChild(factor);
      // 遇到 ） 就退出
      const token = iterator.peek();
      if (token === TokenType.EOF) {
        throw new Error("Unexpected Token EOF");
      }
      // 等于)的时候没有吃掉，而是由外面把这个吃掉
      if (token.getValue() === ")") break;
      iterator.next();
    }
    return functionArgs;
  }
}

export default FunctionArgsStatement;
