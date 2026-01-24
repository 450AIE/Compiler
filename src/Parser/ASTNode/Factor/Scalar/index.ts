import ASTNode, { ASTNodeProps } from "../..";

import { ASTNODE_TYPE } from "../../../consts";

class Scalar extends ASTNode {
  constructor({ label, lexme }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.SCALAR,
      label,
      lexme,
    });
  }
}

export default Scalar;
