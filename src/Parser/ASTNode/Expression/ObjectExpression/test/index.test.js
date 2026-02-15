import { describe, expect, it } from "vitest";
import { TokenType } from "../../../../../Lexer/consts";
import Token from "../../../../../Lexer/Token";
import PeekTokenIterator from "../../../../PeekTokenIterator";
import { ASTNODE_TYPE } from "../../../../consts";
import ObjectExpression from "..";

describe("ObjectExpression", () => {
  it("构造函数默认类型为 OBJECT_EXPRESSION", () => {
    const node = new ObjectExpression({ label: null });
    expect(node.getType()).toBe(ASTNODE_TYPE.OBJECT_EXPRESSION);
  });

  it("可以解析空对象 {}", () => {
    const iterator = new PeekTokenIterator([new Token(TokenType.BRACKET, "{"), new Token(TokenType.BRACKET, "}")]);
    const node = ObjectExpression.parse(iterator);

    expect(node.getType()).toBe(ASTNODE_TYPE.OBJECT_EXPRESSION);
    expect(node.getChildren().length).toBe(0);
    expect(iterator.peek()).toBe(TokenType.EOF);
  });

  it("可以解析对象 {a:1}", () => {
    const iterator = new PeekTokenIterator([
      new Token(TokenType.BRACKET, "{"),
      new Token(TokenType.VARIABLE, "a"),
      new Token(TokenType.PUNCTUATION, ":"),
      new Token(TokenType.NUMBER, "1"),
      new Token(TokenType.BRACKET, "}"),
    ]);
    const node = ObjectExpression.parse(iterator);

    const children = node.getChildren();
    expect(node.getType()).toBe(ASTNODE_TYPE.OBJECT_EXPRESSION);
    expect(children.length).toBe(2);
    expect(children[0].getType()).toBe(ASTNODE_TYPE.VARIABLE);
    expect(children[1].getType()).toBe(ASTNODE_TYPE.EXPRESSION);
    expect(iterator.peek()).toBe(TokenType.EOF);
  });

  it("可以解析对象 {a:1,b:2}（支持逗号分隔）", () => {
    const iterator = new PeekTokenIterator([
      new Token(TokenType.BRACKET, "{"),
      new Token(TokenType.VARIABLE, "a"),
      new Token(TokenType.PUNCTUATION, ":"),
      new Token(TokenType.NUMBER, "1"),
      new Token(TokenType.PUNCTUATION, ","),
      new Token(TokenType.VARIABLE, "b"),
      new Token(TokenType.PUNCTUATION, ":"),
      new Token(TokenType.NUMBER, "2"),
      new Token(TokenType.BRACKET, "}"),
    ]);
    const node = ObjectExpression.parse(iterator);

    const children = node.getChildren();
    expect(children.length).toBe(4);
    expect(children[0].getType()).toBe(ASTNODE_TYPE.VARIABLE);
    expect(children[1].getType()).toBe(ASTNODE_TYPE.EXPRESSION);
    expect(children[2].getType()).toBe(ASTNODE_TYPE.VARIABLE);
    expect(children[3].getType()).toBe(ASTNODE_TYPE.EXPRESSION);
    expect(iterator.peek()).toBe(TokenType.EOF);
  });

  it('可以解析对象 {name:"White Album 2"}', () => {
    const iterator = new PeekTokenIterator([
      new Token(TokenType.BRACKET, "{"),
      new Token(TokenType.VARIABLE, "name"),
      new Token(TokenType.PUNCTUATION, ":"),
      new Token(TokenType.STRING, '"White Album 2"'),
      new Token(TokenType.BRACKET, "}"),
    ]);
    const node = ObjectExpression.parse(iterator);

    const children = node.getChildren();
    expect(children.length).toBe(2);
    expect(children[0].getType()).toBe(ASTNODE_TYPE.VARIABLE);
    expect(children[1].getType()).toBe(ASTNODE_TYPE.EXPRESSION);
    expect(iterator.peek()).toBe(TokenType.EOF);
  });

  it('可以解析对象 {"a":[1],}（支持 key 为标量与尾逗号）', () => {
    const iterator = new PeekTokenIterator([
      new Token(TokenType.BRACKET, "{"),
      new Token(TokenType.STRING, '"a"'),
      new Token(TokenType.PUNCTUATION, ":"),
      new Token(TokenType.BRACKET, "["),
      new Token(TokenType.NUMBER, "1"),
      new Token(TokenType.BRACKET, "]"),
      new Token(TokenType.PUNCTUATION, ","),
      new Token(TokenType.BRACKET, "}"),
    ]);
    const node = ObjectExpression.parse(iterator);

    const children = node.getChildren();
    expect(children.length).toBe(2);
    expect(children[0].getType()).toBe(ASTNODE_TYPE.SCALAR);
    expect(children[1].getType()).toBe(ASTNODE_TYPE.ARRAY_EXPRESSION);
    expect(iterator.peek()).toBe(TokenType.EOF);
  });
});
