import ASTNode, { ASTNodeProps } from "../../..";
import { KEYWORD_TYPE, TokenType } from "../../../../../Lexer/consts";
import Token from "../../../../../Lexer/Token";
import { ASTNODE_TYPE } from "../../../../consts";
import PeekTokenIterator from "../../../../PeekTokenIterator";
import AssignStatement from "../../AssignStatement";
import DeclareStatement from "../../DeclareStatement";

class ForInitStatement extends ASTNode {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.FOR_INIT_STATEMENT,
      label,
    });
  }
  /**
   * for( ForInit ; ForTest ; ForUpdate ) Block
   *
   * ForInit --- DeclareStatement | AssignStatement ｜ null
   * ForTest --- Expression ｜ null
   * ForUpdate --- Expression | AssignStatement | 后续还可能是函数调用等等
   *
   */
  static parse(iterator: PeekTokenIterator) {
    const forInit = new ForInitStatement({ label: null });
    const token = iterator.next() as Token;
    const lookahead = iterator.peek() as Token;
    // 根据下两个token判断
    // 变量 + 运算符 --- AssignStatement
    // CONST等 --- DeclareStatement
    // ； --- null
    const type = token?.getType();
    const value = token?.getValue();
    let child;
    if (type === TokenType.VARIABLE && lookahead?.getValue() === "=") {
      iterator.unget();
      child = AssignStatement.parse(iterator);
    } else if (type === TokenType.KEYWORD && [KEYWORD_TYPE.CONST, KEYWORD_TYPE.LET].includes(value as any)) {
      iterator.unget();
      child = DeclareStatement.parse(iterator);
    } else if (value === ";") {
      iterator.unget();
      child = null;
    }
    forInit.addChild(child);
    return forInit;
  }
}

export default ForInitStatement;
