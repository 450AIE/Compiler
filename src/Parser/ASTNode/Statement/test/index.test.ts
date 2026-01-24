import { describe, expect, it } from "vitest";
import { TokenType } from "../../../../Lexer/consts";
import Token from "../../../../Lexer/Token";
import PeekTokenIterator from "../../../PeekTokenIterator";
import AssignStatement from "../AssignStatement";
import IfStatement from "../IfStatement";
import Statement from "..";

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
    expect(stmt).toBeInstanceOf(AssignStatement);
  });

  it("可以分发为 if 语句", () => {
    const iterator = new PeekTokenIterator([
      new Token(TokenType.KEYWORD, "IF"),
      new Token(TokenType.BRACKET, "("),
      new Token(TokenType.VARIABLE, "x"),
      new Token(TokenType.BRACKET, ")"),
    ]);
    const stmt = Statement.parse(iterator);
    expect(stmt).toBeInstanceOf(IfStatement);
  });

  it("非赋值且非 if 的场景会返回 null 并回退已消费 token", () => {
    const iterator = new PeekTokenIterator([
      new Token(TokenType.VARIABLE, "a"),
      new Token(TokenType.OPERATOR, "+"),
      new Token(TokenType.NUMBER, "1"),
    ]);
    const stmt = Statement.parse(iterator);
    expect(stmt).toBe(null);
    const next = iterator.peek() as Token;
    expect(next.getValue()).toBe("a");
  });
});
