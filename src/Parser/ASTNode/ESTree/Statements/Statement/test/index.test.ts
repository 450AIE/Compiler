import { describe, expect, it } from "vitest";
import { KEYWORD_TYPE, TokenType } from "../../../../../../Lexer/consts";
import Token from "../../../../../../Lexer/Token";
import PeekTokenIterator from "../../../../../PeekTokenIterator";
import IfStatement from "../../Choice/IfStatement";
import Statement from "..";
import AssignExpression from "../../../Expressions/AssignmentExpression";
import "../../../registry";

const makeToken = (type: TokenType, value: string) =>
  new Token({
    type,
    value,
    loc: {
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 0, index: 0 },
    },
  });

describe("Statement.parse", () => {
  it("空 token 列表会返回 null", () => {
    const iterator = new PeekTokenIterator([]);
    const stmt = Statement.parse(iterator);
    expect(stmt).toBe(null);
  });

  it("遇到右花括号会返回 null 且不消费该 token", () => {
    const iterator = new PeekTokenIterator([makeToken(TokenType.BRACKET, "}")]);
    const stmt = Statement.parse(iterator);
    expect(stmt).toBe(null);
    const next = iterator.peek() as Token;
    expect(next.getValue()).toBe("}");
  });

  it("可以分发为赋值语句 a = 1", () => {
    const iterator = new PeekTokenIterator([
      makeToken(TokenType.VARIABLE, "a"),
      makeToken(TokenType.OPERATOR, "="),
      makeToken(TokenType.NUMBER, "1"),
    ]);
    const stmt = Statement.parse(iterator);
    expect(stmt).toBeInstanceOf(AssignExpression);
  });

  it("可以分发为 if 语句", () => {
    const iterator = new PeekTokenIterator([
      makeToken(TokenType.KEYWORD, KEYWORD_TYPE.IF),
      makeToken(TokenType.BRACKET, "("),
      makeToken(TokenType.VARIABLE, "x"),
      makeToken(TokenType.BRACKET, ")"),
      makeToken(TokenType.BRACKET, "{"),
      makeToken(TokenType.BRACKET, "}"),
    ]);
    const stmt = Statement.parse(iterator);
    expect(stmt).toBeInstanceOf(IfStatement);
  });
});
