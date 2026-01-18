import ASTNode, { ASTNODE_TYPE } from "./ASTNode";

class Statement extends ASTNode {
  constructor({ parent, type, label }: { parent: ASTNode | null; type: ASTNODE_TYPE; label: string | null }) {
    super({
      parent,
      type,
      label,
    });
  }
}

export default Statement;
