import Statement from "..";
import { ASTNodeProps } from "../..";
import { ASTNODE_TYPE } from "../../../consts";

class BlockStatement extends Statement {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.BLOCK,
      label,
    });
  }
}

export default BlockStatement;
