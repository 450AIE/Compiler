import ASTNode, { ASTNodeProps } from "../..";
import Token from "../../../../Lexer/Token";
import { ASTNODE_TYPE } from "../../../consts";
import PeekTokenIterator from "../../../PeekTokenIterator";
import AssignStatement from "../AssignStatement";

class DeclareStatement extends ASTNode {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.VARIABLE_DECLARE_STATEMENT,
      label,
    });
  }
  static parse(iterator: PeekTokenIterator) {
    const declare = new DeclareStatement({ label: null });
    const keyword = iterator.next();
    const assignment = AssignStatement.parse(iterator);
    declare.lexme = keyword as Token;
    declare.addChild(assignment);
    return declare;
  }
}

export default DeclareStatement;
