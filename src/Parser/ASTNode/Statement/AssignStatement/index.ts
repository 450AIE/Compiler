import Statement from "..";
import { ASTNodeProps } from "../..";
import { ASTNODE_TYPE } from "../../../consts";

class AssignStatement extends Statement {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.ASSIGN_STATEMENT,
      label,
    });
  }
}

export default AssignStatement;
