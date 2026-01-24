import { describe, expect, it } from "vitest";
import { TokenType } from "../../../../Lexer/consts";
import Token from "../../../../Lexer/Token";
import PeekTokenIterator from "../../../PeekTokenIterator";
import { ASTNODE_TYPE } from "../../../consts";
import Expression from "..";

describe("Expression", () => {
  const getRoot = (node: Expression) => node.getChildren()[0];

  it("构造函数默认类型为 EXPRESSION", () => {
    const node = new Expression({ label: null });
    expect(node.getType()).toBe(ASTNODE_TYPE.EXPRESSION);
  });

  it("可以解析简单表达式 1 + 2", () => {
    const tokens = [
      new Token(TokenType.NUMBER, "1"),
      new Token(TokenType.OPERATOR, "+"),
      new Token(TokenType.NUMBER, "2"),
    ];
    const iterator = new PeekTokenIterator(tokens);
    const node = Expression.parse(iterator);
    expect(node.getType()).toBe(ASTNODE_TYPE.EXPRESSION);
    expect(getRoot(node).getType()).toBe(ASTNODE_TYPE.BINARY_OPERATOR);
    expect(getRoot(node).getLabel()).toBe("+");
    expect(iterator.peek()).toBe(TokenType.EOF);
  });

  it("可以解析带括号的表达式 (1+2)", () => {
    const tokens = [
      new Token(TokenType.BRACKET, "("),
      new Token(TokenType.NUMBER, "1"),
      new Token(TokenType.OPERATOR, "+"),
      new Token(TokenType.NUMBER, "2"),
      new Token(TokenType.BRACKET, ")"),
    ];
    const iterator = new PeekTokenIterator(tokens);
    const node = Expression.parse(iterator);
    expect(node.getType()).toBe(ASTNODE_TYPE.EXPRESSION);
    expect(getRoot(node).getType()).toBe(ASTNODE_TYPE.BINARY_OPERATOR);
    expect(iterator.peek()).toBe(TokenType.EOF);
  });

  it("可以解析乘法优先级 1+2*3", () => {
    const tokens = [
      new Token(TokenType.NUMBER, "1"),
      new Token(TokenType.OPERATOR, "+"),
      new Token(TokenType.NUMBER, "2"),
      new Token(TokenType.OPERATOR, "*"),
      new Token(TokenType.NUMBER, "3"),
    ];
    const iterator = new PeekTokenIterator(tokens);
    const node = Expression.parse(iterator);
    const root = getRoot(node);
    expect(root.getType()).toBe(ASTNODE_TYPE.BINARY_OPERATOR);
    expect(root.getLabel()).toBe("+");

    const right = root.getChildren()[1];
    expect(right.getType()).toBe(ASTNODE_TYPE.BINARY_OPERATOR);
    expect(right.getLabel()).toBe("*");
    expect(iterator.peek()).toBe(TokenType.EOF);
  });

  it("可以解析括号改变优先级 (1+2)*3", () => {
    const tokens = [
      new Token(TokenType.BRACKET, "("),
      new Token(TokenType.NUMBER, "1"),
      new Token(TokenType.OPERATOR, "+"),
      new Token(TokenType.NUMBER, "2"),
      new Token(TokenType.BRACKET, ")"),
      new Token(TokenType.OPERATOR, "*"),
      new Token(TokenType.NUMBER, "3"),
    ];
    const iterator = new PeekTokenIterator(tokens);
    const node = Expression.parse(iterator);
    const root = getRoot(node);
    expect(root.getType()).toBe(ASTNODE_TYPE.BINARY_OPERATOR);
    expect(root.getLabel()).toBe("*");

    const left = root.getChildren()[0];
    expect(left.getType()).toBe(ASTNODE_TYPE.BINARY_OPERATOR);
    expect(left.getLabel()).toBe("+");
    expect(iterator.peek()).toBe(TokenType.EOF);
  });

  it("可以解析嵌套括号 1*(2+(3*4))", () => {
    const tokens = [
      new Token(TokenType.NUMBER, "1"),
      new Token(TokenType.OPERATOR, "*"),
      new Token(TokenType.BRACKET, "("),
      new Token(TokenType.NUMBER, "2"),
      new Token(TokenType.OPERATOR, "+"),
      new Token(TokenType.BRACKET, "("),
      new Token(TokenType.NUMBER, "3"),
      new Token(TokenType.OPERATOR, "*"),
      new Token(TokenType.NUMBER, "4"),
      new Token(TokenType.BRACKET, ")"),
      new Token(TokenType.BRACKET, ")"),
    ];
    const iterator = new PeekTokenIterator(tokens);
    const node = Expression.parse(iterator);
    const root = getRoot(node);
    expect(root.getType()).toBe(ASTNODE_TYPE.BINARY_OPERATOR);
    expect(root.getLabel()).toBe("*");
    expect(iterator.peek()).toBe(TokenType.EOF);
  });

  it("缺失右括号会抛错", () => {
    const tokens = [
      new Token(TokenType.BRACKET, "("),
      new Token(TokenType.NUMBER, "1"),
      new Token(TokenType.OPERATOR, "+"),
      new Token(TokenType.NUMBER, "2"),
    ];
    const iterator = new PeekTokenIterator(tokens);
    expect(() => Expression.parse(iterator)).toThrowError();
  });

  it("遇到未支持的运算符会抛错", () => {
    const tokens = [
      new Token(TokenType.NUMBER, "1"),
      new Token(TokenType.OPERATOR, "^"),
      new Token(TokenType.NUMBER, "2"),
    ];
    const iterator = new PeekTokenIterator(tokens);
    expect(() => Expression.parse(iterator)).toThrowError();
  });
});
