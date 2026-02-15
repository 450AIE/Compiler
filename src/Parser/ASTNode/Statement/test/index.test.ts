import { describe, expect, it } from "vitest";
import { KEYWORD_TYPE, TokenType } from "../../../../Lexer/consts";
import Token from "../../../../Lexer/Token";
import PeekTokenIterator from "../../../PeekTokenIterator";
import IfStatement from "../IfStatement";
import Statement from "..";
import AssignExpression from "../../Expression/AssignExpression";

describe("Statement.parse", () => {
  it("空 token 列表会返回 null", () => {
    const iterator = new PeekTokenIterator([]);
    const stmt = Statement.parse(iterator);
    expect(stmt).toBe(null);
  });

  it("遇到右花括号会返回 null 且不消费该 token", () => {
    const iterator = new PeekTokenIterator([new Token(TokenType.BRACKET, "}")]);
    const stmt = Statement.parse(iterator);
    expect(stmt).toBe(null);
    const next = iterator.peek() as Token;
    expect(next.getValue()).toBe("}");
  });

  it("可以分发为赋值语句 a = 1", () => {
    const iterator = new PeekTokenIterator([
      new Token(TokenType.VARIABLE, "a"),
      new Token(TokenType.OPERATOR, "="),
      new Token(TokenType.NUMBER, "1"),
    ]);
    const stmt = Statement.parse(iterator);
    expect(stmt).toBeInstanceOf(AssignExpression);
  });

  it("可以分发为 if 语句", () => {
    const iterator = new PeekTokenIterator([
      new Token(TokenType.KEYWORD, KEYWORD_TYPE.IF),
      new Token(TokenType.BRACKET, "("),
      new Token(TokenType.VARIABLE, "x"),
      new Token(TokenType.BRACKET, ")"),
      new Token(TokenType.BRACKET, "{"),
      new Token(TokenType.BRACKET, "}"),
    ]);
    const stmt = Statement.parse(iterator);
    expect(stmt).toBeInstanceOf(IfStatement);
  });
});
