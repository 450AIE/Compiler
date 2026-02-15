export const TokenType = {
  // 运算符
  OPERATOR: "OPERATOR",
  // 数字
  NUMBER: "NUMBER",
  // 布尔值
  BOOLEAN: "BOOLEAN",
  // 空值
  NULL: "NULL",
  // undefined
  UNDEFINED: "UNDEFINED",
  // 字符串
  STRING: "STRING",
  // 大整数
  BIGINT: "BIGINT",
  // 变量
  VARIABLE: "VARIABLE",
  // 括号
  BRACKET: "BRACKET",
  // 关键字
  KEYWORD: "KEYWORD",
  // 注释
  COMMENT: "COMMENT",
  // 结束符
  EOF: "EOF",
  // 标点符号
  PUNCTUATION: "PUNCTUATION",
} as const;

export type TokenType = (typeof TokenType)[keyof typeof TokenType];

export const PUNCTUATION_TYPE = {
  COMMA: ",",
  SEMICOLON: ";",
  COLON: ":",
  DOT: ".",
} as const;

export type PUNCTUATION_TYPE = (typeof PUNCTUATION_TYPE)[keyof typeof PUNCTUATION_TYPE];

export const KEYWORD_TYPE = {
  IF: "if",
  LET: "let",
  CONST: "const",
  RETURN: "return",
  ELSE: "else",
  ELSE_IF: "else if",
  WHILE: "while",
  FOR: "for",
  IN: "in",
  OF: "of",
  BREAK: "break",
  CONTINUE: "continue",
  FUNCTION: "function",
  CLASS: "class",
  NEW: "new",
  THIS: "this",
  SUPER: "super",
  DELETE: "delete",
  YIELD: "yield",
  AWAIT: "await",
  VOID: "void",
  TYPEOF: "typeof",
  INSTANCEOF: "instanceof",
} as const;

export type KEYWORD_TYPE = (typeof KEYWORD_TYPE)[keyof typeof KEYWORD_TYPE];

// 运算符优先级表
export const OPERATOR_MAP = [
  ["&", "|", "^"],
  ["==", "!=", ">", "<", ">=", "<="],
  ["+", "-"],
  ["*", "/"],
  ["<<", ">>"],
] as const;

export type OPERATOR_TYPE = (typeof OPERATOR_MAP)[number][number];
