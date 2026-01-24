import { describe, expect, it } from "vitest";
import { TokenType } from "../../../../../../Lexer/consts";
import Token from "../../../../../../Lexer/Token";
import PeekTokenIterator from "../../../../../PeekTokenIterator";
import { ASTNODE_TYPE } from "../../../../../consts";
import Program from "..";

describe("Program", () => {
  it("构造函数可以正确设置类型", () => {
    const node = new Program({ label: null });
    expect(node.getType()).toBe(ASTNODE_TYPE.PROGRAM);
  });

  it("parse 会解析 {} 并返回 Program", () => {
    const tokens = [new Token(TokenType.BRACKET, "{"), new Token(TokenType.BRACKET, "}")];
    const iterator = new PeekTokenIterator(tokens);
    const node = Program.parse(iterator);

    expect(node).toBeInstanceOf(Program);
    expect(node.getType()).toBe(ASTNODE_TYPE.PROGRAM);
    expect(iterator.peek()).toBe(TokenType.EOF);
  });
});
