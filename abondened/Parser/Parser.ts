// @ts-nocheck
import ASTNode from "./ASTNode";
import Expression from "./Expression";

/**
 * 语法分析器
 */
class Parser extends ASTNode {
  constructor(parent: ASTNode | null) {
    super({
      parent,
    });
  }
  static parse() {}
}
