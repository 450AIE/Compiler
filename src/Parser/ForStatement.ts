import Statement from "./Statement";

import ASTNode from "./ASTNode";

import { ASTNODE_TYPE } from "./ASTNode";

class ForStatement extends Statement {
  constructor({ parent, label }: { parent: ASTNode | null; label: string | null }) {
    super({
      parent,
      type: ASTNODE_TYPE.FOR_STATEMENT,
      label,
    });
  }
}

export default ForStatement;
