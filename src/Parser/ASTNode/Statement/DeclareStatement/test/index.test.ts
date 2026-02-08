import { describe, expect, it } from "vitest";
import { KEYWORD_TYPE, TokenType } from "../../../../../Lexer/consts";
import Token from "../../../../../Lexer/Token";
import PeekTokenIterator from "../../../../PeekTokenIterator";
import { ASTNODE_TYPE } from "../../../../consts";
import DeclareStatement from "..";
import Statement from "../..";

describe("DeclareStatement.parse", () => {
  it("可以解析 let a = 1", () => {
    const iterator = new PeekTokenIterator([
      new Token(TokenType.KEYWORD, KEYWORD_TYPE.LET),
      new Token(TokenType.VARIABLE, "a"),
      new Token(TokenType.OPERATOR, "="),
      new Token(TokenType.NUMBER, "1"),
    ]);

    const node = DeclareStatement.parse(iterator);
    expect(node.getType()).toBe(ASTNODE_TYPE.VARIABLE_DECLARE_STATEMENT);
    expect(node.getLexeme()?.getValue()).toBe(KEYWORD_TYPE.LET);

    const children = node.getChildren();
    expect(children.length).toBe(1);
    expect(children[0].getType()).toBe(ASTNODE_TYPE.ASSIGN_STATEMENT);
  });

  it("可以解析 const a = 1", () => {
    const iterator = new PeekTokenIterator([
      new Token(TokenType.KEYWORD, KEYWORD_TYPE.CONST),
      new Token(TokenType.VARIABLE, "a"),
      new Token(TokenType.OPERATOR, "="),
      new Token(TokenType.NUMBER, "1"),
    ]);

    const node = DeclareStatement.parse(iterator);
    expect(node.getType()).toBe(ASTNODE_TYPE.VARIABLE_DECLARE_STATEMENT);
    expect(node.getLexeme()?.getValue()).toBe(KEYWORD_TYPE.CONST);
  });
});

describe("Statement.parse (declare dispatch)", () => {
  it("遇到 let 会分发为 DeclareStatement", () => {
    const iterator = new PeekTokenIterator([
      new Token(TokenType.KEYWORD, KEYWORD_TYPE.LET),
      new Token(TokenType.VARIABLE, "a"),
      new Token(TokenType.OPERATOR, "="),
      new Token(TokenType.NUMBER, "1"),
    ]);

    const stmt = Statement.parse(iterator);
    expect(stmt?.getType()).toBe(ASTNODE_TYPE.VARIABLE_DECLARE_STATEMENT);
  });

  it("遇到 const 会分发为 DeclareStatement", () => {
    const iterator = new PeekTokenIterator([
      new Token(TokenType.KEYWORD, KEYWORD_TYPE.CONST),
      new Token(TokenType.VARIABLE, "a"),
      new Token(TokenType.OPERATOR, "="),
      new Token(TokenType.NUMBER, "1"),
    ]);

    const stmt = Statement.parse(iterator);
    expect(stmt?.getType()).toBe(ASTNODE_TYPE.VARIABLE_DECLARE_STATEMENT);
  });
});
