import Statement from "./Statement";

import ASTNode from "./ASTNode";

import { ASTNODE_TYPE } from "./ASTNode";

class IfStatement extends Statement {
  constructor({ parent, label }: { parent: ASTNode | null; label: string | null }) {
    super({
      parent,
      type: ASTNODE_TYPE.IF_STATEMENT,
      label,
    });
  }
}

export default IfStatement;
