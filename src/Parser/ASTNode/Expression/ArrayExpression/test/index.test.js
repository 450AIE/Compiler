import { describe, expect, it } from "vitest";
import { TokenType } from "../../../../../Lexer/consts";
import Token from "../../../../../Lexer/Token";
import PeekTokenIterator from "../../../../PeekTokenIterator";
import { ASTNODE_TYPE } from "../../../../consts";
import ArrayExpression from "..";

describe("ArrayExpression", () => {
  it("构造函数默认类型为 ARRAY_EXPRESSION", () => {
    const node = new ArrayExpression({ label: null });
    expect(node.getType()).toBe(ASTNODE_TYPE.ARRAY_EXPRESSION);
  });

  it("可以解析空数组 []", () => {
    const iterator = new PeekTokenIterator([new Token(TokenType.BRACKET, "["), new Token(TokenType.BRACKET, "]")]);
    const node = ArrayExpression.parse(iterator);

    expect(node.getType()).toBe(ASTNODE_TYPE.ARRAY_EXPRESSION);
    expect(node.getChildren().length).toBe(0);
    expect(iterator.peek()).toBe(TokenType.EOF);
  });

  it("可以解析数组 [1,2,3]", () => {
    const iterator = new PeekTokenIterator([
      new Token(TokenType.BRACKET, "["),
      new Token(TokenType.NUMBER, "1"),
      new Token(TokenType.PUNCTUATION, ","),
      new Token(TokenType.NUMBER, "2"),
      new Token(TokenType.PUNCTUATION, ","),
      new Token(TokenType.NUMBER, "3"),
      new Token(TokenType.BRACKET, "]"),
    ]);
    const node = ArrayExpression.parse(iterator);

    const children = node.getChildren();
    expect(node.getType()).toBe(ASTNODE_TYPE.ARRAY_EXPRESSION);
    expect(children.length).toBe(3);
    expect(children[0].getType()).toBe(ASTNODE_TYPE.EXPRESSION);
    expect(children[1].getType()).toBe(ASTNODE_TYPE.EXPRESSION);
    expect(children[2].getType()).toBe(ASTNODE_TYPE.EXPRESSION);
    expect(iterator.peek()).toBe(TokenType.EOF);
  });

  it("可以解析混合与嵌套元素 [1, 2+3, [4], a=5]", () => {
    const iterator = new PeekTokenIterator([
      new Token(TokenType.BRACKET, "["),
      new Token(TokenType.NUMBER, "1"),
      new Token(TokenType.PUNCTUATION, ","),
      new Token(TokenType.NUMBER, "2"),
      new Token(TokenType.OPERATOR, "+"),
      new Token(TokenType.NUMBER, "3"),
      new Token(TokenType.PUNCTUATION, ","),
      new Token(TokenType.BRACKET, "["),
      new Token(TokenType.NUMBER, "4"),
      new Token(TokenType.BRACKET, "]"),
      new Token(TokenType.PUNCTUATION, ","),
      new Token(TokenType.VARIABLE, "a"),
      new Token(TokenType.OPERATOR, "="),
      new Token(TokenType.NUMBER, "5"),
      new Token(TokenType.BRACKET, "]"),
    ]);
    const node = ArrayExpression.parse(iterator);

    const children = node.getChildren();
    expect(children.length).toBe(4);

    expect(children[0].getType()).toBe(ASTNODE_TYPE.EXPRESSION);

    expect(children[1].getType()).toBe(ASTNODE_TYPE.EXPRESSION);
    expect(children[1].getChildren()[0].getType()).toBe(ASTNODE_TYPE.BINARY_OPERATOR);
    expect(children[1].getChildren()[0].getLabel()).toBe("+");

    expect(children[2].getType()).toBe(ASTNODE_TYPE.ARRAY_EXPRESSION);

    expect(children[3].getType()).toBe(ASTNODE_TYPE.ASSIGN_EXPRESSION);
    expect(children[3].getChildren().length).toBe(2);

    expect(iterator.peek()).toBe(TokenType.EOF);
  });
});
