import Statement from "..";
import { ASTNodeProps } from "../..";
import { ASTNODE_TYPE } from "../../../consts";
import PeekTokenIterator from "../../../PeekTokenIterator";

class BlockStatement extends Statement {
  constructor({ label, type }: ASTNodeProps) {
    super({
      type: type ?? ASTNODE_TYPE.BLOCK,
      label,
    });
  }
  /**
   * block即先吃掉{，最后吃掉}，中间不断去解析statement
   * 如果是Program调用的就不需要{}，毕竟文件首尾也不需要括号
   */
  static parse(iterator: PeekTokenIterator, isRunByProgram: boolean = false) {
    const block = new BlockStatement({ label: null });
    if (!isRunByProgram) iterator.nextTokenMatchByValue("{");
    while (iterator.hasNext()) {
      // statement.parse内部会判断下一个语句是if，for，while还是什么进行分发处理
      const statement = Statement.parse(iterator);
      // 解析完毕
      if (!statement) break;
      block.addChild(statement);
    }
    if (!isRunByProgram) iterator.nextTokenMatchByValue("}");
    return block;
  }
}

export default BlockStatement;
