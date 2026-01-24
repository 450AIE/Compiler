import BlockStatement from "..";
import Statement from "..";
import { ASTNodeProps } from "../../..";
import { ASTNODE_TYPE } from "../../../../consts";
import PeekTokenIterator from "../../../../PeekTokenIterator";

/**
 * Program继承自BlockStatement的原因是：将Program当作一个巨大的Block，即将单个文件作为Block，然后来
 * 管理这个文件的各个statement语句
 */
class Program extends BlockStatement {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.PROGRAM,
      label,
    });
  }
  static parse(iterator: PeekTokenIterator) {
    const program = new Program({ label: null });
    program.addChild(BlockStatement.parse(iterator, true));
    return program;
  }
}

export default Program;
