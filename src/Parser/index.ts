import { TokenType } from "../Lexer/consts";
import Token from "../Lexer/Token";
import Program from "./ASTNode/Statement/BlockStatement/Program";
import PeekTokenIterator from "./PeekTokenIterator";

/**
 * 语法解析器
 */
class Parser {
  static parse(tokens: Token[]) {
    const iterator = new PeekTokenIterator(tokens);
    // 1个文件作为1个Program
    const program = new Program({ label: null });
    while (iterator.hasNext()) {
      const token = iterator.peek();
      if (token === TokenType.EOF) break;
      const type = token.getType();
    }
    return program;
  }
}

export default Parser;
