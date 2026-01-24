import { describe, expect, it } from "vitest";
import { KEYWORD_TYPE, TokenType } from "../../../../../Lexer/consts";
import Token from "../../../../../Lexer/Token";
import PeekTokenIterator from "../../../../PeekTokenIterator";
import { ASTNODE_TYPE } from "../../../../consts";
import IfStatement from "..";

describe("IfStatement.parse", () => {
  it("构造函数可以正确设置类型", () => {
    const node = new IfStatement({ label: null });
    expect(node.getType()).toBe(ASTNODE_TYPE.IF_STATEMENT);
  });

  it("可以解析 if + else block", () => {
    const iterator = new PeekTokenIterator([
      new Token(TokenType.BRACKET, KEYWORD_TYPE.IF),
      new Token(TokenType.BRACKET, "("),
      new Token(TokenType.NUMBER, "1"),
      new Token(TokenType.BRACKET, ")"),
      new Token(TokenType.BRACKET, "{"),
      new Token(TokenType.BRACKET, "}"),
      new Token(TokenType.KEYWORD, KEYWORD_TYPE.ELSE),
      new Token(TokenType.BRACKET, "{"),
      new Token(TokenType.BRACKET, "}"),
    ]);

    const node = IfStatement.parse(iterator);
    expect(node.getType()).toBe(ASTNODE_TYPE.IF_STATEMENT);

    const children = node.getChildren();
    expect(children.length).toBe(3);
    expect(children[0].getType()).toBe(ASTNODE_TYPE.EXPRESSION);
    expect(children[1].getType()).toBe(ASTNODE_TYPE.BLOCK);
    expect(children[2].getType()).toBe(ASTNODE_TYPE.BLOCK);
  });

  it("可以解析没有 else 的 if", () => {
    const iterator = new PeekTokenIterator([
      new Token(TokenType.KEYWORD, KEYWORD_TYPE.IF),
      new Token(TokenType.BRACKET, "("),
      new Token(TokenType.NUMBER, "1"),
      new Token(TokenType.BRACKET, ")"),
      new Token(TokenType.BRACKET, "{"),
      new Token(TokenType.BRACKET, "}"),
    ]);

    const node = IfStatement.parse(iterator);
    const children = node.getChildren();
    expect(children.length).toBe(2);
    expect(children[0].getType()).toBe(ASTNODE_TYPE.EXPRESSION);
    expect(children[1].getType()).toBe(ASTNODE_TYPE.BLOCK);
  });

  it("缺失左括号会抛错", () => {
    const iterator = new PeekTokenIterator([new Token(TokenType.NUMBER, "1")]);
    expect(() => IfStatement.parse(iterator)).toThrowError();
  });

  it("缺失右括号会抛错", () => {
    const iterator = new PeekTokenIterator([
      new Token(TokenType.KEYWORD, KEYWORD_TYPE.IF),
      new Token(TokenType.BRACKET, "("),
      new Token(TokenType.NUMBER, "1"),
      new Token(TokenType.BRACKET, "{"),
      new Token(TokenType.BRACKET, "}"),
    ]);
    expect(() => IfStatement.parse(iterator)).toThrowError();
  });

  it("else 后不是 block 会抛错", () => {
    const iterator = new PeekTokenIterator([
      new Token(TokenType.KEYWORD, KEYWORD_TYPE.IF),
      new Token(TokenType.BRACKET, "("),
      new Token(TokenType.NUMBER, "1"),
      new Token(TokenType.BRACKET, ")"),
      new Token(TokenType.BRACKET, "{"),
      new Token(TokenType.BRACKET, "}"),
      new Token(TokenType.KEYWORD, KEYWORD_TYPE.ELSE),
      new Token(TokenType.VARIABLE, "x"),
    ]);
    expect(() => IfStatement.parse(iterator)).toThrowError();
  });

  it("可以解析 else if", () => {
    const iterator = new PeekTokenIterator([
      new Token(TokenType.KEYWORD, KEYWORD_TYPE.IF),
      new Token(TokenType.BRACKET, "("),
      new Token(TokenType.NUMBER, "1"),
      new Token(TokenType.BRACKET, ")"),
      new Token(TokenType.BRACKET, "{"),
      new Token(TokenType.BRACKET, "}"),
      new Token(TokenType.KEYWORD, KEYWORD_TYPE.ELSE),
      new Token(TokenType.KEYWORD, KEYWORD_TYPE.IF),
      new Token(TokenType.BRACKET, "("),
      new Token(TokenType.NUMBER, "2"),
      new Token(TokenType.BRACKET, ")"),
      new Token(TokenType.BRACKET, "{"),
      new Token(TokenType.BRACKET, "}"),
      new Token(TokenType.KEYWORD, KEYWORD_TYPE.ELSE),
      new Token(TokenType.BRACKET, "{"),
      new Token(TokenType.BRACKET, "}"),
    ]);
    const node = IfStatement.parse(iterator);
    const children = node.getChildren();
    expect(children.length).toBe(3);
    expect(children[2].getType()).toBe(ASTNODE_TYPE.IF_STATEMENT);
  });
});
