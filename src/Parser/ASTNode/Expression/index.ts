import ASTNode, { ASTNodeProps } from "..";
import { ASTNODE_TYPE } from "../../consts";

class Expression extends ASTNode {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.EXPRESSION,
      label,
    });
  }
}

export default Expression;
