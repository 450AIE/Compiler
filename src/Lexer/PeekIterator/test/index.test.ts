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

  it("nextSourceChar 可以读取字符并返回带有位置信息的对象", () => {
    const itor = new PeekIterator("ab");
    expect(itor.hasNext()).toBe(true);

    const char1 = itor.nextSourceChar();
    expect(char1.value).toBe("a");
    expect(char1.loc).toEqual({
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 1, index: 1 },
    });

    const char2 = itor.nextSourceChar();
    expect(char2.value).toBe("b");
    expect(char2.loc).toEqual({
      start: { line: 1, column: 1, index: 1 },
      end: { line: 1, column: 2, index: 2 },
    });

    expect(itor.hasNext()).toBe(true);
    const eof = itor.nextSourceChar();
    expect(eof.value).toBe(TokenType.EOF);
    expect(itor.hasNext()).toBe(false);
  });

  it("nextSourceChar 可以正确处理换行符的位置信息", () => {
    const itor = new PeekIterator("a\nb");

    const char1 = itor.nextSourceChar();
    expect(char1.value).toBe("a");
    expect(char1.loc).toEqual({
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 1, index: 1 },
    });

    const char2 = itor.nextSourceChar();
    expect(char2.value).toBe("\n");
    expect(char2.loc).toEqual({
      start: { line: 1, column: 1, index: 1 },
      end: { line: 2, column: 0, index: 2 },
    });

    const char3 = itor.nextSourceChar();
    expect(char3.value).toBe("b");
    expect(char3.loc).toEqual({
      start: { line: 2, column: 0, index: 2 },
      end: { line: 2, column: 1, index: 3 },
    });
  });

  it("nextSourceChar 可以正确处理制表符的位置信息", () => {
    const itor = new PeekIterator("a\tb");

    const char1 = itor.nextSourceChar();
    expect(char1.value).toBe("a");
    expect(char1.loc).toEqual({
      start: { line: 1, column: 0, index: 0 },
      end: { line: 1, column: 1, index: 1 },
    });

    const char2 = itor.nextSourceChar();
    expect(char2.value).toBe("\t");
    expect(char2.loc).toEqual({
      start: { line: 1, column: 1, index: 1 },
      end: { line: 1, column: 3, index: 3 },
    });

    const char3 = itor.nextSourceChar();
    expect(char3.value).toBe("b");
    expect(char3.loc).toEqual({
      start: { line: 1, column: 3, index: 3 },
      end: { line: 1, column: 4, index: 4 },
    });
  });

  it("nextSourceChar 可以与 peekedQueue 交互", () => {
    const itor = new PeekIterator("abc");

    // 先使用 nextSourceChar 读取一个字符
    const char1 = itor.nextSourceChar();
    expect(char1.value).toBe("a");

    // 使用 putBack 回退
    itor.putBack();

    // 再次使用 nextSourceChar 应该读取到相同的字符
    const char2 = itor.nextSourceChar();
    expect(char2.value).toBe("a");

    // 继续读取剩余字符
    const char3 = itor.nextSourceChar();
    expect(char3.value).toBe("b");

    const char4 = itor.nextSourceChar();
    expect(char4.value).toBe("c");
  });

  it("nextSourceChar 可以与 unget 交互", () => {
    const itor = new PeekIterator("abc");

    // 读取两个字符
    const char1 = itor.nextSourceChar();
    expect(char1.value).toBe("a");

    const char2 = itor.nextSourceChar();
    expect(char2.value).toBe("b");

    // 使用 unget 回退
    itor.unget();

    // 再次读取应该得到 "b"
    const char3 = itor.nextSourceChar();
    expect(char3.value).toBe("b");

    // 继续读取 "c"
    const char4 = itor.nextSourceChar();
    expect(char4.value).toBe("c");
  });

  it("nextSourceChar 处理空字符串时返回 EOF", () => {
    const itor = new PeekIterator("");
    expect(itor.hasNext()).toBe(true);

    const eof = itor.nextSourceChar();
    expect(eof.value).toBe(TokenType.EOF);
    expect(itor.hasNext()).toBe(false);
  });
});
