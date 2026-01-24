import ASTNode from "..";

import { ASTNodeProps } from "..";

class Factor extends ASTNode {
  constructor({ type, label }: ASTNodeProps) {
    super({
      type,
      label,
    });
  }
}

export default Factor;
