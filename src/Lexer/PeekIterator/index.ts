import { TokenType } from "../consts";
import { Char, Location } from "./types";

/**
 * 封装一个支持peek操作的迭代器
 */
class PeekIterator<T = string> {
  private iterator: Iterator<T, undefined>;
  // 调用peek后，将读取的元素放入peekedQueue，链表性能更好，为了简单这里用数组
  private peekedQueue: T[];
  // 调用next后，将读取的元素放入nextedQueue
  private nextedQueue: T[];
  public isDone: boolean;
  // 当前迭代器的位置，line从1开始，column从0开始(规范)
  public location: Location;
  // 接收字符串进行迭代
  constructor(string: Iterable<T>) {
    this.iterator = string[Symbol.iterator]();
    this.peekedQueue = [];
    this.nextedQueue = [];
    this.isDone = false;
    this.location = { line: 1, column: 0, index: 0 };
  }
  // 查看将要迭代吃掉的下一个元素
  peek(): T | "EOF" {
    if (this.peekedQueue.length) {
      return this.peekedQueue[this.peekedQueue.length - 1];
    }
    const char = this.next();
    this.putBack();
    return char;
  }
  // 迭代吃掉下一个元素
  next(): T | "EOF" {
    let value = undefined;
    // 优先消耗之前peek的时候调用next保存的值
    if (this.peekedQueue.length) {
      value = this.peekedQueue.shift();
      // 之前peek保存的都消耗完毕了，直接next迭代
    } else {
      const { value: _value, done } = this.iterator.next();
      value = _value;
      // 迭代完毕，标记，返回EOF
      if (done) {
        this.isDone = true;
        value = TokenType.EOF;
      }
    }
    this.nextedQueue.push(value);
    return value;
  }
  // 迭代吃掉下一个元素，这个专门用来吃源代码，即词法分析阶段，因为next和peek本身只负责吃，不负责包装，而
  // 词法分析需要吃char的时候，包装一下带上loc信息，所以需要单独开一个方法
  nextSourceChar(): Char<string> {
    // @ts-expect-error ...
    let char: Char<string> = {};
    let start: Location;
    // 优先消耗之前peek的时候调用next保存的值
    if (this.peekedQueue.length) {
      char = this.peekedQueue.shift() as Char<string>;
      // 之前peek保存的都消耗完毕了，直接next迭代
    } else {
      start = { ...this.location };
      const { value, done } = this.iterator.next();
      char.value = value as string;
      // 迭代完毕，标记，返回EOF
      if (done) {
        this.isDone = true;
        char.value = TokenType.EOF;
      }
      // 根据当前的字符进行位置的更新
      this.updateLocation(value as string);
      char.loc = {
        start,
        end: { ...this.location },
      };
    }
    this.nextedQueue.push(char as T);
    return char;
  }
  // 更新标记位置
  updateLocation(char: string) {
    switch (char) {
      case "\t": {
        this.location.column += 2;
        this.location.index += 2;
        break;
      }
      case "\n": {
        this.location.line++;
        this.location.column = 0;
        this.location.index++;
        break;
      }
      default: {
        this.location.column++;
        this.location.index++;
      }
    }
  }
  // 将刚刚next读取的字符放到peekQueue尾部中
  putBack() {
    this.peekedQueue.push(this.nextedQueue.pop());
  }
  // 将刚刚next读取的字符放到peekQueue头部中，用于next + peek查看两个元素判断的时候调用unget保证第一次next消费的元素在下次
  // next还可以正常消费读取
  unget() {
    this.peekedQueue.unshift(this.nextedQueue.pop());
  }
  // 见刚刚next读取的字符放到peekQueue的头部，让下一次next可以直接再次消费这个元素，主要是用于
  // Lexer的parse的while循环中，已经next消费了一个 + peek又查看了一个，接下来调用Token.makeXXXX时
  // 需要保证函数内第一次next消费的是Lexer的while中next消费的元素，如果使用putBack顺序会反，所以使用putBackFirst
  // 你可以举例 Lexer.parse(67)，使用putBack就会得到76
  // 但是输入  空格67的话，这个又会错误，所以无解
  // putBackFirst() {
  //   this.peekedQueue.unshift(this.nextedQueue.pop());
  // }
  // 是否可以继续迭代
  hasNext() {
    // 第一个isDone可能是最后一次调用peek后，peek调用next读取了最后一个字符导致isDone为true的，但是实际上
    // 最后一个字符没有被消费，所以还要查看peekedQueue是否为空，即!this.peek()
    return !this.isDone || !this.peek();
  }
}

export default PeekIterator;
