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

export const KEYWORD_TYPE = {
  IF: "IF",
  LET: "LET",
  CONST: "CONST",
  RETURN: "RETURN",
  ELSE: "ELSE",
  WHILE: "WHILE",
  FOR: "FOR",
  IN: "IN",
  OF: "OF",
  BREAK: "BREAK",
  CONTINUE: "CONTINUE",
  FUNCTION: "FUNCTION",
  CLASS: "CLASS",
  NEW: "NEW",
  THIS: "THIS",
  SUPER: "SUPER",
  DELETE: "DELETE",
  YIELD: "YIELD",
  AWAIT: "AWAIT",
  VOID: "VOID",
  TYPEOF: "TYPEOF",
  INSTANCEOF: "INSTANCEOF",
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
