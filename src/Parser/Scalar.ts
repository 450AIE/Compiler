import Factor from "./Factor";

import ASTNode, { ASTNODE_TYPE } from "./ASTNode";

/**
 * 标量，即常量
 */
class Scalar extends Factor {
  constructor({ parent, label }: { parent: ASTNode | null; label: string | null }) {
    super({
      parent,
      type: ASTNODE_TYPE.SCALAR,
      label,
    });
  }
}

export default Scalar;
