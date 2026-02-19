import { describe, expect, it } from "vitest";
import { TokenType } from "../../../../../Lexer/consts";
import Token from "../../../../../Lexer/Token";
import PeekTokenIterator from "../../../../PeekTokenIterator";
import { ASTNODE_TYPE } from "../../../../consts";
import BlockStatement from "..";

const makeToken = (type: TokenType, value: string) =>
  new Token({
    type,
    value,
    loc: {
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 0, index: 0 },
    },
  });

describe("BlockStatement", () => {
  it("构造函数默认类型为 BLOCK", () => {
    const node = new BlockStatement({ label: null });
    expect(node.getType()).toBe(ASTNODE_TYPE.BLOCK);
  });

  it("可以解析空 block: { }", () => {
    const tokens = [makeToken(TokenType.BRACKET, "{"), makeToken(TokenType.BRACKET, "}")];
    const iterator = new PeekTokenIterator(tokens);
    const node = BlockStatement.parse(iterator);

    expect(node.getType()).toBe(ASTNODE_TYPE.BLOCK);
    expect(node.getChildren()).toEqual([]);
    expect(iterator.peek()).toBe(TokenType.EOF);
  });
});
