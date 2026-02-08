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
});
