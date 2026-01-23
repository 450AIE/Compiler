import Lexer from "./Lexer";
import { TokenType } from "./Token";

function* arrayToGenerator<T>(arr: Array<T>) {
  for (let item of arr) {
    yield item;
  }
}

export default arrayToGenerator;

function tokenize(sourceChars: Array<string>) {
  const lexer = new Lexer();
  return lexer.analyze(arrayToGenerator(sourceChars));
}

function assertTokens(testName: string, source: string, expected: Array<[string, string]>) {
  const tokens = tokenize(source.split(""));
  const actual = tokens.map((t) => [t.getType(), t.getValue()] as [string, string]);

  if (actual.length !== expected.length) {
    throw new Error(
      `${testName} failed: token length mismatch\nsource: ${JSON.stringify(
        source,
      )}\nexpected: ${JSON.stringify(expected)}\nactual: ${JSON.stringify(actual)}`,
    );
  }

  for (let i = 0; i < expected.length; i += 1) {
    const [et, ev] = expected[i];
    const [at, av] = actual[i];
    if (et !== at || ev !== av) {
      throw new Error(
        `${testName} failed at index ${i}\nsource: ${JSON.stringify(
          source,
        )}\nexpected: ${JSON.stringify(expected)}\nactual: ${JSON.stringify(actual)}`,
      );
    }
  }
}

function main() {
  assertTokens("basic operators/brackets/keyword", "IF(a>=10){a=a+1;}", [
    [TokenType.KEY_WORD, "IF"],
    [TokenType.BRACKET, "("],
    [TokenType.VARIABLE, "a"],
    [TokenType.OPERATOR, ">="],
    [TokenType.NUMBER, "10"],
    [TokenType.BRACKET, ")"],
    [TokenType.BRACKET, "{"],
    [TokenType.VARIABLE, "a"],
    [TokenType.OPERATOR, "="],
    [TokenType.VARIABLE, "a"],
    [TokenType.OPERATOR, "+"],
    [TokenType.NUMBER, "1"],
    [TokenType.OPERATOR, ";"],
    [TokenType.BRACKET, "}"],
  ]);

  assertTokens("string and signed numbers", `a=-5+ +6; b="hi";`, [
    [TokenType.VARIABLE, "a"],
    [TokenType.OPERATOR, "="],
    [TokenType.NUMBER, "-5"],
    [TokenType.OPERATOR, "+"],
    [TokenType.NUMBER, "+6"],
    [TokenType.OPERATOR, ";"],
    [TokenType.VARIABLE, "b"],
    [TokenType.OPERATOR, "="],
    [TokenType.STRING, '"hi'],
    [TokenType.OPERATOR, ";"],
  ]);

  const preview = tokenize("IF(x<1){x=x+1;}".split(""));
  const formatted = preview.map((t) => `${t.getType()}:${t.getValue()}`).join(" ");
  console.log("Lexer test passed.");
  console.log(formatted);
}

main();
