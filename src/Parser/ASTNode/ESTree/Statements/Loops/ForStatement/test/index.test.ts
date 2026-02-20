import { describe, expect, it } from "vitest";
import { KEYWORD_TYPE, TokenType } from "../../../../../../../Lexer/consts";
import Token from "../../../../../../../Lexer/Token";
import PeekTokenIterator from "../../../../../../PeekTokenIterator";
import { ASTNODE_TYPE } from "../../../../../../consts";
import ForStatement from "..";

const makeToken = (type: TokenType, value: string) =>
  new Token({
    type,
    value,
    loc: {
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 0, index: 0 },
    },
  });

describe("ForStatement.parse", () => {
  it("构造函数可以正确设置类型", () => {
    const node = new ForStatement({ label: null });
    expect(node.getType()).toBe(ASTNODE_TYPE.FOR_STATEMENT);
  });

  it("可以解析 for(LET b = 1; b == 10; b = b + 1) {}", () => {
    const iterator = new PeekTokenIterator([
      makeToken(TokenType.KEYWORD, KEYWORD_TYPE.FOR),
      makeToken(TokenType.BRACKET, "("),
      makeToken(TokenType.KEYWORD, KEYWORD_TYPE.LET),
      makeToken(TokenType.VARIABLE, "b"),
      makeToken(TokenType.OPERATOR, "="),
      makeToken(TokenType.NUMBER, "1"),
      makeToken(TokenType.PUNCTUATION, ";"),
      makeToken(TokenType.VARIABLE, "b"),
      makeToken(TokenType.OPERATOR, "=="),
      makeToken(TokenType.NUMBER, "10"),
      makeToken(TokenType.PUNCTUATION, ";"),
      makeToken(TokenType.VARIABLE, "b"),
      makeToken(TokenType.OPERATOR, "="),
      makeToken(TokenType.VARIABLE, "b"),
      makeToken(TokenType.OPERATOR, "+"),
      makeToken(TokenType.NUMBER, "1"),
      makeToken(TokenType.BRACKET, ")"),
      makeToken(TokenType.BRACKET, "{"),
      makeToken(TokenType.BRACKET, "}"),
    ]);

    const node = ForStatement.parse(iterator);
    expect(node.getType()).toBe(ASTNODE_TYPE.FOR_STATEMENT);
    expect((node.getLexeme() as Token).getValue()).toBe(KEYWORD_TYPE.FOR);
  });

  it("可以解析 for(; b < 10; b = b + 1) {}", () => {
    const iterator = new PeekTokenIterator([
      makeToken(TokenType.KEYWORD, KEYWORD_TYPE.FOR),
      makeToken(TokenType.BRACKET, "("),
      makeToken(TokenType.PUNCTUATION, ";"),
      makeToken(TokenType.VARIABLE, "b"),
      makeToken(TokenType.OPERATOR, "<"),
      makeToken(TokenType.NUMBER, "10"),
      makeToken(TokenType.PUNCTUATION, ";"),
      makeToken(TokenType.VARIABLE, "b"),
      makeToken(TokenType.OPERATOR, "="),
      makeToken(TokenType.VARIABLE, "b"),
      makeToken(TokenType.OPERATOR, "+"),
      makeToken(TokenType.NUMBER, "1"),
      makeToken(TokenType.BRACKET, ")"),
      makeToken(TokenType.BRACKET, "{"),
      makeToken(TokenType.BRACKET, "}"),
    ]);

    const node = ForStatement.parse(iterator);
    expect(node.getType()).toBe(ASTNODE_TYPE.FOR_STATEMENT);
  });

  it("可以解析 for(b = 1; b < 10; b = b + 1) {}", () => {
    const iterator = new PeekTokenIterator([
      makeToken(TokenType.KEYWORD, KEYWORD_TYPE.FOR),
      makeToken(TokenType.BRACKET, "("),
      makeToken(TokenType.VARIABLE, "b"),
      makeToken(TokenType.OPERATOR, "="),
      makeToken(TokenType.NUMBER, "1"),
      makeToken(TokenType.PUNCTUATION, ";"),
      makeToken(TokenType.VARIABLE, "b"),
      makeToken(TokenType.OPERATOR, "<"),
      makeToken(TokenType.NUMBER, "10"),
      makeToken(TokenType.PUNCTUATION, ";"),
      makeToken(TokenType.VARIABLE, "b"),
      makeToken(TokenType.OPERATOR, "="),
      makeToken(TokenType.VARIABLE, "b"),
      makeToken(TokenType.OPERATOR, "+"),
      makeToken(TokenType.NUMBER, "1"),
      makeToken(TokenType.BRACKET, ")"),
      makeToken(TokenType.BRACKET, "{"),
      makeToken(TokenType.BRACKET, "}"),
    ]);

    const node = ForStatement.parse(iterator);
    expect(node.getType()).toBe(ASTNODE_TYPE.FOR_STATEMENT);
  });

  it("可以解析 for(LET b = 1;; b = b + 1) {}", () => {
    const iterator = new PeekTokenIterator([
      makeToken(TokenType.KEYWORD, KEYWORD_TYPE.FOR),
      makeToken(TokenType.BRACKET, "("),
      makeToken(TokenType.KEYWORD, KEYWORD_TYPE.LET),
      makeToken(TokenType.VARIABLE, "b"),
      makeToken(TokenType.OPERATOR, "="),
      makeToken(TokenType.NUMBER, "1"),
      makeToken(TokenType.PUNCTUATION, ";"),
      makeToken(TokenType.PUNCTUATION, ";"),
      makeToken(TokenType.VARIABLE, "b"),
      makeToken(TokenType.OPERATOR, "="),
      makeToken(TokenType.VARIABLE, "b"),
      makeToken(TokenType.OPERATOR, "+"),
      makeToken(TokenType.NUMBER, "1"),
      makeToken(TokenType.BRACKET, ")"),
      makeToken(TokenType.BRACKET, "{"),
      makeToken(TokenType.BRACKET, "}"),
    ]);

    const node = ForStatement.parse(iterator);
    expect(node.getType()).toBe(ASTNODE_TYPE.FOR_STATEMENT);
  });

  it("可以解析 for(LET b = 1; b < 10;) {}", () => {
    const iterator = new PeekTokenIterator([
      makeToken(TokenType.KEYWORD, KEYWORD_TYPE.FOR),
      makeToken(TokenType.BRACKET, "("),
      makeToken(TokenType.KEYWORD, KEYWORD_TYPE.LET),
      makeToken(TokenType.VARIABLE, "b"),
      makeToken(TokenType.OPERATOR, "="),
      makeToken(TokenType.NUMBER, "1"),
      makeToken(TokenType.PUNCTUATION, ";"),
      makeToken(TokenType.VARIABLE, "b"),
      makeToken(TokenType.OPERATOR, "<"),
      makeToken(TokenType.NUMBER, "10"),
      makeToken(TokenType.PUNCTUATION, ";"),
      makeToken(TokenType.BRACKET, ")"),
      makeToken(TokenType.BRACKET, "{"),
      makeToken(TokenType.BRACKET, "}"),
    ]);

    const node = ForStatement.parse(iterator);
    expect(node.getType()).toBe(ASTNODE_TYPE.FOR_STATEMENT);
  });

  it("可以解析 for(;;) {}", () => {
    const iterator = new PeekTokenIterator([
      makeToken(TokenType.KEYWORD, KEYWORD_TYPE.FOR),
      makeToken(TokenType.BRACKET, "("),
      makeToken(TokenType.PUNCTUATION, ";"),
      makeToken(TokenType.PUNCTUATION, ";"),
      makeToken(TokenType.BRACKET, ")"),
      makeToken(TokenType.BRACKET, "{"),
      makeToken(TokenType.BRACKET, "}"),
    ]);

    const node = ForStatement.parse(iterator);
    expect(node.getType()).toBe(ASTNODE_TYPE.FOR_STATEMENT);
  });
});
