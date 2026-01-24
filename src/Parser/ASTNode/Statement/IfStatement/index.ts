import ASTNode from "../..";
import { ASTNodeProps } from "../..";
import { KEYWORD_TYPE, TokenType } from "../../../../Lexer/consts";
import Token from "../../../../Lexer/Token";
import { ASTNODE_TYPE } from "../../../consts";
import PeekTokenIterator from "../../../PeekTokenIterator";
import Expression from "../../Expression";
import BlockStatement from "../BlockStatement";

class IfStatement extends ASTNode {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.IF_STATEMENT,
      label,
    });
  }
  /**
   * IF (Expression) {Block} Tail
   *
   * Tail ---> else {Block} | else IfStatement | null
   */
  static parse(iterator: PeekTokenIterator) {
    const ifStatement = new IfStatement({ label: null });
    iterator.nextTokenMatchByValue(KEYWORD_TYPE.IF);
    const bracketToken = iterator.next() as Token;
    const type = bracketToken.getType();
    const value = bracketToken.getValue();
    if (!(type === TokenType.BRACKET && value === "(")) {
      throw new Error(`Syntax Error: ifStatement no "(" exsit`);
    }
    const expression = Expression.parse(iterator);
    iterator.nextTokenMatchByValue(")");
    const block = BlockStatement.parse(iterator);
    const tail = IfStatement.parseTail(iterator);
    ifStatement.addChild(expression);
    ifStatement.addChild(block);
    if (tail) ifStatement.addChild(tail);
    return ifStatement;
  }
  private static parseTail(iterator: PeekTokenIterator) {
    const elseToken = iterator.peek();
    if (elseToken === TokenType.EOF || elseToken.getValue() !== KEYWORD_TYPE.ELSE) {
      return null;
    }
    iterator.nextTokenMatchByValue(KEYWORD_TYPE.ELSE);
    const token = iterator.peek() as Token;
    const type = token.getType();
    const value = token.getValue();
    if (type === TokenType.BRACKET && value === "{") {
      return BlockStatement.parse(iterator);
    } else if (value === KEYWORD_TYPE.IF && type === TokenType.KEYWORD) {
      return IfStatement.parse(iterator);
    }
    throw new Error(`Syntax Error: Unexpected token after else: ${token}`);
  }
}

export default IfStatement;
