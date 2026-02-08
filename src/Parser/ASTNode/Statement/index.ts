import ASTNode from "..";

import { ASTNodeProps } from "..";
import { KEYWORD_TYPE, TokenType } from "../../../Lexer/consts";
import Token from "../../../Lexer/Token";
import PeekTokenIterator from "../../PeekTokenIterator";
import AssignStatement from "./AssignStatement";
import DeclareStatement from "./DeclareStatement";
import FunctionDeclareStatement from "./FunctionStatement";
import IfStatement from "./IfStatement";

/**
 * Statement是语句的含义，这个应该设计为抽象类
 */
class Statement extends ASTNode {
  constructor({ type, label }: ASTNodeProps) {
    super({
      type,
      label,
    });
  }
  /**
   * 通用的语句解析，内部根据Token的类型分发到不同的语句进行处理，比如if，while等
   */
  static parse(iterator: PeekTokenIterator) {
    if (!iterator.hasNext()) return null;
    /**
     * 这里必须向后面看2个参数才可以实现确定是什么类型，比如变量赋值是
     * a = 1，函数调用时a()，需要看后面是=还是(判断
     */
    const token = iterator.peek();
    if (token === TokenType.EOF) return null;
    const type = token.getType();
    const value = token.getValue();
    // 遇到block的时候会循环Statement.parse调用，而block进入的标志就是{，所以当遇到}的时候就要退出
    if (value === "}") return null;
    iterator.next();
    const lookahead = iterator.peek() as Token;
    // 是赋值语句，比如a = 1
    if (type === TokenType.VARIABLE && lookahead?.getValue() === "=") {
      iterator.unget();
      return AssignStatement.parse(iterator);
      // 变量声明语句
    } else if (type === TokenType.KEYWORD && [KEYWORD_TYPE.CONST, KEYWORD_TYPE.LET].includes(value as any)) {
      iterator.unget();
      return DeclareStatement.parse(iterator);
      // if语句，进入这里的时候，已经把IF消费了
    } else if (type === TokenType.KEYWORD && value === KEYWORD_TYPE.IF) {
      iterator.unget();
      return IfStatement.parse(iterator);
      // 函数声明语句
    } else if (type === TokenType.KEYWORD && value === KEYWORD_TYPE.FUNCTION) {
      iterator.unget();
      return FunctionDeclareStatement.parse(iterator);
    }
    iterator.putBack();
    return null;
  }
}

export default Statement;
