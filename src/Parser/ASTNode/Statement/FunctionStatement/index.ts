import ASTNode, { ASTNodeProps } from "../..";
import { KEYWORD_TYPE } from "../../../../Lexer/consts";
import { ASTNODE_TYPE } from "../../../consts";
import PeekTokenIterator from "../../../PeekTokenIterator";
import Factor from "../../Factor";
import BlockStatement from "../BlockStatement";
import FunctionArgsStatement from "./FunctionArgs";

class FunctionDeclareStatement extends ASTNode {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.FUNCTION_DECLARE_STATEMENT,
      label,
    });
  }
  /**
   * function variable(...args) Block
   */
  static parse(iterator: PeekTokenIterator) {
    const functionDeclare = new FunctionDeclareStatement({ label: null });
    const keyword = iterator.nextTokenMatchByValue(KEYWORD_TYPE.FUNCTION);
    const funcNameFactor = Factor.parse(iterator);
    iterator.nextTokenMatchByValue("(");
    const funcArgs = FunctionArgsStatement.parse(iterator);
    iterator.nextTokenMatchByValue(")");
    const funcBlock = BlockStatement.parse(iterator);
    functionDeclare.lexme = keyword;
    functionDeclare.addChild(funcNameFactor);
    functionDeclare.addChild(funcArgs);
    functionDeclare.addChild(funcBlock);
    return functionDeclare;
  }
}

export default FunctionDeclareStatement;
