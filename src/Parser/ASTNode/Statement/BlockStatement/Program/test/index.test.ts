import { describe, expect, it } from "vitest";
import { TokenType } from "../../../../../../Lexer/consts";
import Token from "../../../../../../Lexer/Token";
import PeekTokenIterator from "../../../../../PeekTokenIterator";
import { ASTNODE_TYPE } from "../../../../../consts";
import BlockStatement from "../..";
import Program from "..";

describe("Program", () => {
  it("构造函数可以正确设置类型", () => {
    const node = new Program({ label: null });
    expect(node.getType()).toBe(ASTNODE_TYPE.PROGRAM);
  });

  it("parse 会按 BlockStatement.parse 的逻辑解析", () => {
    const tokens = [new Token(TokenType.BRACKET, "{"), new Token(TokenType.BRACKET, "}")];
    const iterator = new PeekTokenIterator(tokens);
    const node = Program.parse(iterator);

    expect(node).toBeInstanceOf(BlockStatement);
    expect(node.getType()).toBe(ASTNODE_TYPE.BLOCK);
    expect(iterator.peek()).toBe(TokenType.EOF);
  });
});
