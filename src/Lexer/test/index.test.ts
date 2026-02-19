import { describe, expect, it } from "vitest";
import Lexer from "../index";
import { KEYWORD_TYPE, TokenType } from "../consts";

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
    expect(tokens).toHaveLength(6);
    expect(tokens[0].type).toBe(TokenType.BRACKET);
    expect(tokens[0].value).toBe("(");
    expect(tokens[0].loc).toEqual({
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 1, index: 1 },
    });
    expect(tokens[1].type).toBe(TokenType.BRACKET);
    expect(tokens[1].value).toBe(")");
    expect(tokens[1].loc).toEqual({
      start: { line: 1, column: 1, index: 1 },
      end: { line: 1, column: 2, index: 2 },
    });
    expect(tokens[2].type).toBe(TokenType.BRACKET);
    expect(tokens[2].value).toBe("[");
    expect(tokens[2].loc).toEqual({
      start: { line: 1, column: 2, index: 2 },
      end: { line: 1, column: 3, index: 3 },
    });
    expect(tokens[3].type).toBe(TokenType.BRACKET);
    expect(tokens[3].value).toBe("]");
    expect(tokens[3].loc).toEqual({
      start: { line: 1, column: 3, index: 3 },
      end: { line: 1, column: 4, index: 4 },
    });
    expect(tokens[4].type).toBe(TokenType.BRACKET);
    expect(tokens[4].value).toBe("{");
    expect(tokens[4].loc).toEqual({
      start: { line: 1, column: 4, index: 4 },
      end: { line: 1, column: 5, index: 5 },
    });
    expect(tokens[5].type).toBe(TokenType.BRACKET);
    expect(tokens[5].value).toBe("}");
    expect(tokens[5].loc).toEqual({
      start: { line: 1, column: 5, index: 5 },
      end: { line: 1, column: 6, index: 6 },
    });
  });

  it("可以解析数字与变量", () => {
    const tokens = Lexer.parse("a 123 b");
    expect(tokens).toHaveLength(3);
    expect(tokens[0].type).toBe(TokenType.VARIABLE);
    expect(tokens[0].value).toBe("a");
    expect(tokens[0].loc).toEqual({
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 1, index: 1 },
    });
    expect(tokens[1].type).toBe(TokenType.NUMBER);
    expect(tokens[1].value).toBe("123");
    expect(tokens[1].loc).toEqual({
      start: { line: 1, column: 2, index: 2 },
      end: { line: 1, column: 5, index: 5 },
    });
    expect(tokens[2].type).toBe(TokenType.VARIABLE);
    expect(tokens[2].value).toBe("b");
    expect(tokens[2].loc).toEqual({
      start: { line: 1, column: 6, index: 6 },
      end: { line: 1, column: 7, index: 7 },
    });
  });

  it("可以解析关键字与括号组合", () => {
    const tokens = Lexer.parse("if(x)");
    expect(tokens).toHaveLength(4);
    expect(tokens[0].type).toBe(TokenType.KEYWORD);
    expect(tokens[0].value).toBe(KEYWORD_TYPE.IF);
    expect(tokens[0].loc).toEqual({
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 2, index: 2 },
    });
    expect(tokens[1].type).toBe(TokenType.BRACKET);
    expect(tokens[1].value).toBe("(");
    expect(tokens[1].loc).toEqual({
      start: { line: 1, column: 2, index: 2 },
      end: { line: 1, column: 3, index: 3 },
    });
    expect(tokens[2].type).toBe(TokenType.VARIABLE);
    expect(tokens[2].value).toBe("x");
    expect(tokens[2].loc).toEqual({
      start: { line: 1, column: 3, index: 3 },
      end: { line: 1, column: 4, index: 4 },
    });
    expect(tokens[3].type).toBe(TokenType.BRACKET);
    expect(tokens[3].value).toBe(")");
    expect(tokens[3].loc).toEqual({
      start: { line: 1, column: 4, index: 4 },
      end: { line: 1, column: 5, index: 5 },
    });
  });

  it("可以解析字符串", () => {
    const tokens = Lexer.parse('"hi" \'ok\'');
    expect(tokens).toHaveLength(2);
    expect(tokens[0].type).toBe(TokenType.STRING);
    expect(tokens[0].value).toBe('"hi"');
    expect(tokens[0].loc).toEqual({
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 4, index: 4 },
    });
    expect(tokens[1].type).toBe(TokenType.STRING);
    expect(tokens[1].value).toBe("'ok'");
    expect(tokens[1].loc).toEqual({
      start: { line: 1, column: 5, index: 5 },
      end: { line: 1, column: 9, index: 9 },
    });
  });

  it("可以解析运算符", () => {
    const tokens = Lexer.parse("a+b>=c");
    expect(tokens).toHaveLength(5);
    expect(tokens[0].type).toBe(TokenType.VARIABLE);
    expect(tokens[0].value).toBe("a");
    expect(tokens[0].loc).toEqual({
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 1, index: 1 },
    });
    expect(tokens[1].type).toBe(TokenType.OPERATOR);
    expect(tokens[1].value).toBe("+");
    expect(tokens[1].loc).toEqual({
      start: { line: 1, column: 1, index: 1 },
      end: { line: 1, column: 2, index: 2 },
    });
    expect(tokens[2].type).toBe(TokenType.VARIABLE);
    expect(tokens[2].value).toBe("b");
    expect(tokens[2].loc).toEqual({
      start: { line: 1, column: 2, index: 2 },
      end: { line: 1, column: 3, index: 3 },
    });
    expect(tokens[3].type).toBe(TokenType.OPERATOR);
    expect(tokens[3].value).toBe(">=");
    expect(tokens[3].loc).toEqual({
      start: { line: 1, column: 3, index: 3 },
      end: { line: 1, column: 5, index: 5 },
    });
    expect(tokens[4].type).toBe(TokenType.VARIABLE);
    expect(tokens[4].value).toBe("c");
    expect(tokens[4].loc).toEqual({
      start: { line: 1, column: 5, index: 5 },
      end: { line: 1, column: 6, index: 6 },
    });
  });

  it("遇到未知字符会抛错", () => {
    expect(() => Lexer.parse("@")).toThrowError();
  });
});
