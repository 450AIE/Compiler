import { TokenType } from "../consts";
import Token from "../Token";

/**
 * 封装一个支持peek操作的迭代器
 */
class PeekIterator<T = string> {
  private iterator: Iterator<T, undefined>;
  // 调用peek后，将读取的元素放入peekedQueue，链表性能更好，为了简单这里用数组
  private peekedQueue: (T | "EOF")[];
  // 调用next后，将读取的元素放入nextedQueue
  private nextedQueue: (T | "EOF")[];
  public isDone: boolean;
  // 接收字符串进行迭代
  constructor(string: Iterable<T>) {
    this.iterator = string[Symbol.iterator]();
    this.peekedQueue = [];
    this.nextedQueue = [];
    this.isDone = false;
  }
  // 查看将要迭代吃掉的下一个元素
  peek(): T | "EOF" {
    if (this.peekedQueue.length) {
      return this.peekedQueue[this.peekedQueue.length - 1];
    }
    const val = this.next();
    this.putBack();
    return val;
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
