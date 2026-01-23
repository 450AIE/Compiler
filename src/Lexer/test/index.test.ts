import { describe, expect, it } from "vitest";
import Lexer from "../index";
import { TokenType } from "../consts";

describe("Lexer.parse", () => {
  it("可以解析空字符串", () => {
    const tokens = Lexer.parse("");
    expect(tokens).toEqual([]);
  });

  it("可以忽略空格与换行", () => {
    const tokens = Lexer.parse(" \n ");
    expect(tokens).toEqual([]);
  });

  it("可以解析括号", () => {
    const tokens = Lexer.parse("()[]{}");
    expect(tokens).toEqual([
      { type: TokenType.BRACKET, value: "(" },
      { type: TokenType.BRACKET, value: ")" },
      { type: TokenType.BRACKET, value: "[" },
      { type: TokenType.BRACKET, value: "]" },
      { type: TokenType.BRACKET, value: "{" },
      { type: TokenType.BRACKET, value: "}" },
    ]);
  });

  it("可以解析数字与变量", () => {
    const tokens = Lexer.parse("a 123 b");
    expect(tokens).toEqual([
      { type: TokenType.VARIABLE, value: "a" },
      { type: TokenType.NUMBER, value: "123" },
      { type: TokenType.VARIABLE, value: "b" },
    ]);
  });

  it("可以解析关键字与括号组合", () => {
    const tokens = Lexer.parse("IF(x)");
    expect(tokens).toEqual([
      { type: TokenType.KEYWORD, value: "IF" },
      { type: TokenType.BRACKET, value: "(" },
      { type: TokenType.VARIABLE, value: "x" },
      { type: TokenType.BRACKET, value: ")" },
    ]);
  });

  it("可以解析字符串", () => {
    const tokens = Lexer.parse("\"hi\" 'ok'");
    expect(tokens).toEqual([
      { type: TokenType.STRING, value: '"hi"' },
      { type: TokenType.STRING, value: "'ok'" },
    ]);
  });

  it("可以解析运算符", () => {
    const tokens = Lexer.parse("a+b>=c");
    expect(tokens).toEqual([
      { type: TokenType.VARIABLE, value: "a" },
      { type: TokenType.OPERATOR, value: "+" },
      { type: TokenType.VARIABLE, value: "b" },
      { type: TokenType.OPERATOR, value: ">=" },
      { type: TokenType.VARIABLE, value: "c" },
    ]);
  });

  it("遇到未知字符会抛错", () => {
    expect(() => Lexer.parse("@")).toThrowError();
  });
});
