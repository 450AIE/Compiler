import ASTNode from "./ASTNode";

import { ASTNODE_TYPE } from "./ASTNode";

class Factor extends ASTNode {
  constructor({ parent, label, type }: { parent: ASTNode | null; label: string | null; type: ASTNODE_TYPE }) {
    super({
      parent,
      type,
      label,
    });
  }
}

export default Factor;
