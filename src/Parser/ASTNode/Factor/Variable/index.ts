import ASTNode, { ASTNodeProps } from "../..";
import { ASTNODE_TYPE } from "../../../consts";

class Variable extends ASTNode {
  constructor({ label, lexme }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.VARIABLE,
      label,
      lexme,
    });
  }
}

export default Variable;
