import ASTNode, { ASTNODE_TYPE } from "./ASTNode";
import Statement from "./Statement";

class Block extends Statement {
  constructor({ parent, label }: { parent: ASTNode | null; label: string | null }) {
    super({
      parent,
      type: ASTNODE_TYPE.BLOCK,
      label,
    });
  }
}

export default Block;
