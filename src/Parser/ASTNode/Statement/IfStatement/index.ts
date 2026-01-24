import ASTNode from "../..";
import { ASTNodeProps } from "../..";
import { ASTNODE_TYPE } from "../../../consts";
import PeekTokenIterator from "../../../PeekTokenIterator";

class IfStatement extends ASTNode {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.IF_STATEMENT,
      label,
    });
  }
  static parse(iterator: PeekTokenIterator) {
    const ifStatement = new IfStatement({ label: null });
    return ifStatement;
  }
}

export default IfStatement;
