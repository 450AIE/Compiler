import ASTNode from "..";

import { ASTNodeProps } from "..";

class Statement extends ASTNode {
  constructor({ type, label }: ASTNodeProps) {
    super({
      type,
      label,
    });
  }
}

export default Statement;
