import { describe, expect, it } from "vitest";
import { TokenType } from "../../../../Lexer/consts";
import Token from "../../../../Lexer/Token";
import PeekTokenIterator from "../../../PeekTokenIterator";
import { ASTNODE_TYPE } from "../../../consts";
import Factor from "..";
import Scalar from "../Scalar";
import Variable from "../Variable";

describe("Factor", () => {
  it("parseToken 可以解析变量", () => {
    const token = new Token(TokenType.VARIABLE, "a");
    const node = Factor.parseToken(token);
    expect(node).toBeInstanceOf(Variable);
    expect(node?.getType()).toBe(ASTNODE_TYPE.VARIABLE);
    expect(node?.getLexeme()).toBe(token);
  });

  it("parseToken 可以解析标量", () => {
    const token = new Token(TokenType.NUMBER, "1");
    const node = Factor.parseToken(token);
    expect(node).toBeInstanceOf(Scalar);
    expect(node?.getType()).toBe(ASTNODE_TYPE.SCALAR);
    expect(node?.getLexeme()).toBe(token);
  });

  it("parseToken 遇到不支持的 token 会返回 null", () => {
    const token = new Token(TokenType.BRACKET, "(");
    const node = Factor.parseToken(token);
    expect(node).toBe(null);
  });

  it("parse 会消费一个 token 并返回对应节点", () => {
    const tokens = [new Token(TokenType.VARIABLE, "a")];
    const iterator = new PeekTokenIterator(tokens);
    const node = Factor.parse(iterator);
    expect(node?.getType()).toBe(ASTNODE_TYPE.VARIABLE);
    expect(iterator.peek()).toBe(TokenType.EOF);
  });
});
