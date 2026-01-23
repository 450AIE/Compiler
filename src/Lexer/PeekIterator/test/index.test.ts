import { describe, expect, it } from "vitest";
import { TokenType } from "../../consts";
import PeekIterator from "../index";

describe("PeekIterator", () => {
  it("可以迭代字符串并在末尾返回 EOF", () => {
    const itor = new PeekIterator("ab");
    expect(itor.hasNext()).toBe(true);
    expect(itor.next()).toBe("a");
    expect(itor.next()).toBe("b");
    expect(itor.hasNext()).toBe(true);
    expect(itor.next()).toBe(TokenType.EOF);
    expect(itor.hasNext()).toBe(false);
  });

  it("peek 不会消费字符", () => {
    const itor = new PeekIterator("ab");
    expect(itor.peek()).toBe("a");
    expect(itor.peek()).toBe("a");
    expect(itor.next()).toBe("a");
    expect(itor.peek()).toBe("b");
    expect(itor.next()).toBe("b");
    expect(itor.peek()).toBe(TokenType.EOF);
    expect(itor.next()).toBe(TokenType.EOF);
    expect(itor.hasNext()).toBe(false);
  });

  it("putBack 可以回退上一次 next 的值", () => {
    const itor = new PeekIterator("abc");
    expect(itor.next()).toBe("a");
    expect(itor.next()).toBe("b");
    itor.putBack();
    expect(itor.next()).toBe("b");
    expect(itor.next()).toBe("c");
    expect(itor.next()).toBe(TokenType.EOF);
  });

  it("可以处理空字符串", () => {
    const itor = new PeekIterator("");
    expect(itor.hasNext()).toBe(true);
    expect(itor.peek()).toBe(TokenType.EOF);
    expect(itor.next()).toBe(TokenType.EOF);
    expect(itor.hasNext()).toBe(false);
  });
});
