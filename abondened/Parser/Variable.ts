// @ts-nocheck
import Factor from "./Factor";

import ASTNode, { ASTNODE_TYPE } from "./ASTNode";
import PeekTokenIterator from "./PeekTokenIterator";

class Variable extends Factor {
  constructor({ parent, iterator }: { parent: ASTNode | null; iterator: PeekTokenIterator }) {
    super(
      {
        parent,
        type: ASTNODE_TYPE.VARIABLE,
      },
      iterator,
    );
  }
}

export default Variable;
