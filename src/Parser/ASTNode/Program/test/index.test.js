import { describe, expect, it } from "vitest";
import { KEYWORD_TYPE, TokenType } from "../../../../Lexer/consts";
import Token from "../../../../Lexer/Token";
import PeekTokenIterator from "../../../PeekTokenIterator";
import { ASTNODE_TYPE } from "../../../consts";
import Program from "..";
import "../../registry";

const makeToken = (type, value) =>
  new Token({
    type,
    value,
    loc: {
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 0, index: 0 },
    },
  });

describe("Program.parse", () => {
  it("空 token 列表会返回空 body", () => {
    const iterator = new PeekTokenIterator([]);
    const program = Program.parse(iterator);
    expect(program.body).toEqual([]);
  });

  it("可以解析 let a = 1", () => {
    const iterator = new PeekTokenIterator([
      makeToken(TokenType.KEYWORD, KEYWORD_TYPE.LET),
      makeToken(TokenType.VARIABLE, "a"),
      makeToken(TokenType.OPERATOR, "="),
      makeToken(TokenType.NUMBER, "1"),
    ]);
    const program = Program.parse(iterator);
    expect(program.body.length).toBe(1);
    expect(program.body[0].getType()).toBe(ASTNODE_TYPE.VARIABLE_DECLARE_STATEMENT);
    expect(iterator.peek()).toBe(TokenType.EOF);
  });
});
