import Factor from "./Factor";

import ASTNode, { ASTNODE_TYPE } from "./ASTNode";

class Variable extends Factor {
  constructor({ parent, label }: { parent: ASTNode | null; label: string | null }) {
    super({
      parent,
      type: ASTNODE_TYPE.VARIABLE,
      label,
    });
  }
}

export default Variable;
