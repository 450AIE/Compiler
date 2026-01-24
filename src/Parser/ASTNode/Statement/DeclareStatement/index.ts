import Statement from "..";
import { ASTNodeProps } from "../..";
import { ASTNODE_TYPE } from "../../../consts";

class DeclareStatement extends Statement {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.FUNCTION_DECLARE_STATEMENT,
      label,
    });
  }
}

export default DeclareStatement;
