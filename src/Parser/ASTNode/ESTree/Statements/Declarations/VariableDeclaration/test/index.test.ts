import { describe, expect, it } from "vitest";
import { KEYWORD_TYPE, TokenType } from "../../../../../../../Lexer/consts";
import Token from "../../../../../../../Lexer/Token";
import PeekTokenIterator from "../../../../../../PeekTokenIterator";
import { ASTNODE_TYPE } from "../../../../../../consts";
import DeclareStatement from "..";
import Statement from "../../../Statement";
import "../../../../registry";

const makeToken = (type: TokenType, value: string) =>
  new Token({
    type,
    value,
    loc: {
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 0, index: 0 },
    },
  });

describe("DeclareStatement.parse", () => {
  it("可以解析 let a = 1", () => {
    const iterator = new PeekTokenIterator([
      makeToken(TokenType.KEYWORD, KEYWORD_TYPE.LET),
      makeToken(TokenType.VARIABLE, "a"),
      makeToken(TokenType.OPERATOR, "="),
      makeToken(TokenType.NUMBER, "1"),
    ]);

    const node = DeclareStatement.parse(iterator);
    expect(node.getType()).toBe(ASTNODE_TYPE.VARIABLE_DECLARE_STATEMENT);
    expect(node.getLexeme()?.getValue()).toBe(KEYWORD_TYPE.LET);

    const children = node.getChildren();
    expect(children.length).toBe(1);
    expect(children[0].getType()).toBe(ASTNODE_TYPE.ASSIGN_EXPRESSION);
  });

  it("可以解析 const a = 1", () => {
    const iterator = new PeekTokenIterator([
      makeToken(TokenType.KEYWORD, KEYWORD_TYPE.CONST),
      makeToken(TokenType.VARIABLE, "a"),
      makeToken(TokenType.OPERATOR, "="),
      makeToken(TokenType.NUMBER, "1"),
    ]);

    const node = DeclareStatement.parse(iterator);
    expect(node.getType()).toBe(ASTNODE_TYPE.VARIABLE_DECLARE_STATEMENT);
    expect(node.getLexeme()?.getValue()).toBe(KEYWORD_TYPE.CONST);
  });
});

describe("Statement.parse (declare dispatch)", () => {
  it("遇到 let 会分发为 DeclareStatement", () => {
    const iterator = new PeekTokenIterator([
      makeToken(TokenType.KEYWORD, KEYWORD_TYPE.LET),
      makeToken(TokenType.VARIABLE, "a"),
      makeToken(TokenType.OPERATOR, "="),
      makeToken(TokenType.NUMBER, "1"),
    ]);

    const stmt = Statement.parse(iterator);
    expect(stmt?.getType()).toBe(ASTNODE_TYPE.VARIABLE_DECLARE_STATEMENT);
  });

  it("遇到 const 会分发为 DeclareStatement", () => {
    const iterator = new PeekTokenIterator([
      makeToken(TokenType.KEYWORD, KEYWORD_TYPE.CONST),
      makeToken(TokenType.VARIABLE, "a"),
      makeToken(TokenType.OPERATOR, "="),
      makeToken(TokenType.NUMBER, "1"),
    ]);

    const stmt = Statement.parse(iterator);
    expect(stmt?.getType()).toBe(ASTNODE_TYPE.VARIABLE_DECLARE_STATEMENT);
  });
});
