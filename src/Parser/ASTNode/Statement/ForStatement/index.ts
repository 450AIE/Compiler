import Statement from "..";
import { ASTNodeProps } from "../..";
import { ASTNODE_TYPE } from "../../../consts";

class ForStatement extends Statement {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.FOR_STATEMENT,
      label,
    });
  }
}

export default ForStatement;
