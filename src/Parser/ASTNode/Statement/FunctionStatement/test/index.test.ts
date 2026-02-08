import { describe, expect, it } from "vitest";
import { KEYWORD_TYPE, TokenType } from "../../../../../Lexer/consts";
import Token from "../../../../../Lexer/Token";
import PeekTokenIterator from "../../../../PeekTokenIterator";
import { ASTNODE_TYPE } from "../../../../consts";
import FunctionDeclareStatement from "..";

describe("FunctionDeclareStatement.parse", () => {
  it("构造函数可以正确设置类型", () => {
    const node = new FunctionDeclareStatement({ label: null });
    expect(node.getType()).toBe(ASTNODE_TYPE.FUNCTION_DECLARE_STATEMENT);
  });

  it("可以解析 function foo() {}", () => {
    const iterator = new PeekTokenIterator([
      new Token(TokenType.KEYWORD, KEYWORD_TYPE.FUNCTION),
      new Token(TokenType.VARIABLE, "foo"),
      new Token(TokenType.BRACKET, "("),
      new Token(TokenType.BRACKET, ")"),
      new Token(TokenType.BRACKET, "{"),
      new Token(TokenType.BRACKET, "}"),
    ]);

    const node = FunctionDeclareStatement.parse(iterator);
    expect(node.getType()).toBe(ASTNODE_TYPE.FUNCTION_DECLARE_STATEMENT);
    expect(node.getLexeme()?.getValue()).toBe(KEYWORD_TYPE.FUNCTION);

    const children = node.getChildren();
    expect(children.length).toBe(3);
    expect(children[0].getType()).toBe(ASTNODE_TYPE.VARIABLE);
    expect(children[1].getType()).toBe(ASTNODE_TYPE.FUNCTION_ARGS_STATEMENT);
    expect(children[2].getType()).toBe(ASTNODE_TYPE.BLOCK);
  });

  it("可以解析 function add(a, b) {}", () => {
    const iterator = new PeekTokenIterator([
      new Token(TokenType.KEYWORD, KEYWORD_TYPE.FUNCTION),
      new Token(TokenType.VARIABLE, "add"),
      new Token(TokenType.BRACKET, "("),
      new Token(TokenType.VARIABLE, "a"),
      new Token(TokenType.PUNCTUATION, ","),
      new Token(TokenType.VARIABLE, "b"),
      new Token(TokenType.BRACKET, ")"),
      new Token(TokenType.BRACKET, "{"),
      new Token(TokenType.BRACKET, "}"),
    ]);

    const node = FunctionDeclareStatement.parse(iterator);
    const args = node.getChildren()[1];
    expect(args.getType()).toBe(ASTNODE_TYPE.FUNCTION_ARGS_STATEMENT);
    expect(args.getChildren().map((c) => c.getType())).toEqual([ASTNODE_TYPE.VARIABLE, ASTNODE_TYPE.VARIABLE]);
  });

  it("缺失右括号会抛错", () => {
    const iterator = new PeekTokenIterator([
      new Token(TokenType.KEYWORD, KEYWORD_TYPE.FUNCTION),
      new Token(TokenType.VARIABLE, "foo"),
      new Token(TokenType.BRACKET, "("),
      new Token(TokenType.BRACKET, "{"),
      new Token(TokenType.BRACKET, "}"),
    ]);

    expect(() => FunctionDeclareStatement.parse(iterator)).toThrowError();
  });
});
