export interface Location {
  line: number;
  column: number;
  // index表示是源代码中的第index个字符(0开始)
  index: number;
}

export interface TokenLocationRange {
  start: Location;
  end: Location;
}

export interface Char<T = string> {
  value: string;
  rawValue?: T;
  loc: TokenLocationRange;
}
