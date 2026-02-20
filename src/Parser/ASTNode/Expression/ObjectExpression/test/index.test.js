import { describe, expect, it } from "vitest";
import { TokenType } from "../../../../../Lexer/consts";
import Token from "../../../../../Lexer/Token";
import PeekTokenIterator from "../../../../PeekTokenIterator";
import { ASTNODE_TYPE } from "../../../../consts";
import ObjectExpression from "..";
import "../../../registry";

const makeToken = (type, value) =>
  new Token({
    type,
    value,
    loc: {
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 0, index: 0 },
    },
  });

describe("ObjectExpression", () => {
  it("构造函数默认类型为 OBJECT_EXPRESSION", () => {
    const node = new ObjectExpression({ label: null });
    expect(node.getType()).toBe(ASTNODE_TYPE.OBJECT_EXPRESSION);
  });

  it("可以解析空对象 {}", () => {
    const iterator = new PeekTokenIterator([makeToken(TokenType.BRACKET, "{"), makeToken(TokenType.BRACKET, "}")]);
    const node = ObjectExpression.parse(iterator);

    expect(node.getType()).toBe(ASTNODE_TYPE.OBJECT_EXPRESSION);
    expect(node.getChildren().length).toBe(0);
    expect(iterator.peek()).toBe(TokenType.EOF);
  });

  it("可以解析对象 {a:1}", () => {
    const iterator = new PeekTokenIterator([
      makeToken(TokenType.BRACKET, "{"),
      makeToken(TokenType.VARIABLE, "a"),
      makeToken(TokenType.PUNCTUATION, ":"),
      makeToken(TokenType.NUMBER, "1"),
      makeToken(TokenType.BRACKET, "}"),
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
      makeToken(TokenType.BRACKET, "{"),
      makeToken(TokenType.VARIABLE, "a"),
      makeToken(TokenType.PUNCTUATION, ":"),
      makeToken(TokenType.NUMBER, "1"),
      makeToken(TokenType.PUNCTUATION, ","),
      makeToken(TokenType.VARIABLE, "b"),
      makeToken(TokenType.PUNCTUATION, ":"),
      makeToken(TokenType.NUMBER, "2"),
      makeToken(TokenType.BRACKET, "}"),
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
      makeToken(TokenType.BRACKET, "{"),
      makeToken(TokenType.VARIABLE, "name"),
      makeToken(TokenType.PUNCTUATION, ":"),
      makeToken(TokenType.STRING, '"White Album 2"'),
      makeToken(TokenType.BRACKET, "}"),
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
      makeToken(TokenType.BRACKET, "{"),
      makeToken(TokenType.STRING, '"a"'),
      makeToken(TokenType.PUNCTUATION, ":"),
      makeToken(TokenType.BRACKET, "["),
      makeToken(TokenType.NUMBER, "1"),
      makeToken(TokenType.BRACKET, "]"),
      makeToken(TokenType.PUNCTUATION, ","),
      makeToken(TokenType.BRACKET, "}"),
    ]);
    const node = ObjectExpression.parse(iterator);

    const children = node.getChildren();
    expect(children.length).toBe(2);
    expect(children[0].getType()).toBe(ASTNODE_TYPE.SCALAR);
    expect(children[1].getType()).toBe(ASTNODE_TYPE.ARRAY_EXPRESSION);
    expect(iterator.peek()).toBe(TokenType.EOF);
  });
});
