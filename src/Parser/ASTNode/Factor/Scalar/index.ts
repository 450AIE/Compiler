import Factor from "..";

import { ASTNodeProps } from "../..";

import { ASTNODE_TYPE } from "../../../consts";

class Scalar extends Factor {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.SCALAR,
      label,
    });
  }
}

export default Scalar;
