import PeekIterator from "../PeekIterator";
import Token, { TokenType } from "../Token";
import ParserError from "./ParserError";

class PeekTokenIterator extends PeekIterator<Token> {
  constructor(it: Generator<Token>) {
    super(it);
  }

  nextMatch(value: string) {
    const token = this.next();
    if (token.getValue() !== value) {
      throw new ParserError(`expect ${value} but get ${token.getValue()}`);
    }
    return token;
  }
  nextMatch1(type: TokenType) {
    const token = this.next();
    if (token.getType() !== type) {
      throw new ParserError(`expect ${type} but get ${token.getType()}`);
    }
    return token;
  }
}

export default PeekTokenIterator;
