import Statement from "..";
import { ASTNodeProps } from "../..";
import { ASTNODE_TYPE } from "../../../consts";

class IfStatement extends Statement {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.IF_STATEMENT,
      label,
    });
  }
}

export default IfStatement;
