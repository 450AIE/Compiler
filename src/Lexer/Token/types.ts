import { TokenType } from "../consts";
import { TokenLocationRange } from "../PeekIterator/types";

export interface TokenProps {
  type: TokenType;
  value: string;
  loc: TokenLocationRange;
}
