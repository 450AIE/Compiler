import { describe, expect, it } from "vitest";
import { KEYWORD_TYPE, TokenType } from "../../../../../Lexer/consts";
import Token from "../../../../../Lexer/Token";
import PeekTokenIterator from "../../../../PeekTokenIterator";
import { ASTNODE_TYPE } from "../../../../consts";
import ForStatement from "..";

describe("ForStatement.parse", () => {
  it("构造函数可以正确设置类型", () => {
    const node = new ForStatement({ label: null });
    expect(node.getType()).toBe(ASTNODE_TYPE.FOR_STATEMENT);
  });

  it("可以解析 for(LET b = 1; b == 10; b = b + 1) {}", () => {
    const iterator = new PeekTokenIterator([
      new Token(TokenType.KEYWORD, KEYWORD_TYPE.FOR),
      new Token(TokenType.BRACKET, "("),
      new Token(TokenType.KEYWORD, KEYWORD_TYPE.LET),
      new Token(TokenType.VARIABLE, "b"),
      new Token(TokenType.OPERATOR, "="),
      new Token(TokenType.NUMBER, "1"),
      new Token(TokenType.PUNCTUATION, ";"),
      new Token(TokenType.VARIABLE, "b"),
      new Token(TokenType.OPERATOR, "=="),
      new Token(TokenType.NUMBER, "10"),
      new Token(TokenType.PUNCTUATION, ";"),
      new Token(TokenType.VARIABLE, "b"),
      new Token(TokenType.OPERATOR, "="),
      new Token(TokenType.VARIABLE, "b"),
      new Token(TokenType.OPERATOR, "+"),
      new Token(TokenType.NUMBER, "1"),
      new Token(TokenType.BRACKET, ")"),
      new Token(TokenType.BRACKET, "{"),
      new Token(TokenType.BRACKET, "}"),
    ]);

    const node = ForStatement.parse(iterator);
    expect(node.getType()).toBe(ASTNODE_TYPE.FOR_STATEMENT);
    expect((node.getLexeme() as Token).getValue()).toBe(KEYWORD_TYPE.FOR);
  });

  it("可以解析 for(;;) {}", () => {
    const iterator = new PeekTokenIterator([
      new Token(TokenType.KEYWORD, KEYWORD_TYPE.FOR),
      new Token(TokenType.BRACKET, "("),
      new Token(TokenType.PUNCTUATION, ";"),
      new Token(TokenType.PUNCTUATION, ";"),
      new Token(TokenType.BRACKET, ")"),
      new Token(TokenType.BRACKET, "{"),
      new Token(TokenType.BRACKET, "}"),
    ]);

    const node = ForStatement.parse(iterator);
    expect(node.getType()).toBe(ASTNODE_TYPE.FOR_STATEMENT);
  });
});
