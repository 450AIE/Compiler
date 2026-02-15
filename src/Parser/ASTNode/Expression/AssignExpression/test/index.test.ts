import { describe, expect, it } from "vitest";
import { TokenType } from "../../../../../Lexer/consts";
import Token from "../../../../../Lexer/Token";
import PeekTokenIterator from "../../../../PeekTokenIterator";
import { ASTNODE_TYPE } from "../../../../consts";
import AssignExpression from "..";

describe("AssignExpression", () => {
  it("构造函数可以正确设置类型", () => {
    const node = new AssignExpression({ label: null });
    expect(node.getType()).toBe(ASTNODE_TYPE.ASSIGN_EXPRESSION);
  });

  it("可以解析 a = 1", () => {
    const tokens = [
      new Token(TokenType.VARIABLE, "a"),
      new Token(TokenType.OPERATOR, "="),
      new Token(TokenType.NUMBER, "1"),
    ];
    const iterator = new PeekTokenIterator(tokens);
    const node = AssignExpression.parse(iterator);

    expect(node.getType()).toBe(ASTNODE_TYPE.ASSIGN_EXPRESSION);
    expect((node.getLexeme() as Token).getValue()).toBe("=");

    const children = node.getChildren();
    expect(children.length).toBe(2);
    expect(children[0].getType()).toBe(ASTNODE_TYPE.VARIABLE);
    expect(children[1].getType()).toBe(ASTNODE_TYPE.EXPRESSION);
  });
});
