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
   */
  static parse(iterator: PeekTokenIterator) {
    const block = new BlockStatement({ label: null });
    iterator.nextTokenMatchByValue("{");
    while (iterator.hasNext()) {
      // statement.parse内部会判断下一个语句是if，for，while还是什么进行分发处理
      const statement = Statement.parse(iterator);
      // 解析完毕
      if (!statement) break;
      block.addChild(statement);
    }
    iterator.nextTokenMatchByValue("}");
    return block;
  }
}

export default BlockStatement;
