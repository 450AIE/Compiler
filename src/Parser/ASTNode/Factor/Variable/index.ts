import Factor from "..";

import { ASTNodeProps } from "../..";
import { ASTNODE_TYPE } from "../../../consts";

class Variable extends Factor {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.VARIABLE,
      label,
    });
  }
}

export default Variable;
