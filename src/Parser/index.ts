import { TokenType } from "../Lexer/consts";
import Token from "../Lexer/Token";
import PeekTokenIterator from "./PeekTokenIterator";
import "./ASTNode/registry";
import Program from "./ASTNode/Program";

/**
 * 语法解析器
 */
class Parser {
  static parse(tokens: Token[]) {
    const iterator = new PeekTokenIterator(tokens);
    // 1个文件作为1个Program
    return Program.parse(iterator);
  }
}

export default Parser;
