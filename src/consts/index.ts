const KEY_WORDS = {
  IF: "IF",
  ELSE: "ELSE",
  WHILE: "WHILE",
  FOR: "FOR",
  RETURN: "RETURN",
  BREAK: "BREAK",
  CONTINUE: "CONTINUE",
  FUNCTION: "FUNCTION",
} as const;

export type KEY_WORDS = (typeof KEY_WORDS)[keyof typeof KEY_WORDS];

export default KEY_WORDS;
