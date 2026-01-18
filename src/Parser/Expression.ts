import ASTNode, { ASTNODE_TYPE } from "./ASTNode";

class Expression extends ASTNode {
  constructor({ parent, label, type }: { parent: ASTNode | null; label: string | null; type: ASTNODE_TYPE }) {
    super({
      parent,
      type,
      label,
    });
  }
}

export default Expression;
