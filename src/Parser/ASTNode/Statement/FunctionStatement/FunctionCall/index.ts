import ASTNode, { ASTNodeProps } from "../../..";
import { TokenType } from "../../../../../Lexer/consts";
import { ASTNODE_TYPE } from "../../../../consts";
import PeekTokenIterator from "../../../../PeekTokenIterator";
import FunctionArgsStatement from "../FunctionArgs";

class FunctionCallStatement extends ASTNode {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.FUNCTION_CALL,
      label,
    });
  }
  /**
   * get(params , params)
   */
  static parse(iterator: PeekTokenIterator) {
    const functionCall = new FunctionCallStatement({ label: null });
    const keyword = iterator.nextTokenMatchByType(TokenType.VARIABLE);
    iterator.nextTokenMatchByValue("(");
    const params = FunctionArgsStatement.parse(iterator);
    iterator.nextTokenMatchByValue(")");
    functionCall.addChild(params);
    functionCall.lexme = keyword;
    return functionCall;
  }
}

export default FunctionCallStatement;
