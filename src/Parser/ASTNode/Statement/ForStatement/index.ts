import Statement from "..";
import { ASTNodeProps } from "../..";
import { ASTNODE_TYPE } from "../../../consts";
import PeekTokenIterator from "../../../PeekTokenIterator";

class ForStatement extends Statement {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.FOR_STATEMENT,
      label,
    });
  }
  /**
   * for( DeclareStatement; Expression ; Expression ) Block
   */
  static parse(iterator: PeekTokenIterator) {}
}

export default ForStatement;
