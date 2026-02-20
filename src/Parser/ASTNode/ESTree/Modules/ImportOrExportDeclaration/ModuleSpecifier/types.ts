import { Location } from "../../../../../../Lexer/PeekIterator/types";

export interface ModuleSpecifierLocal {
  type: string;
  start: number;
  end: number;
  loc: {
    start: Location;
    end: Location;
    identifierName: string;
  };
  name: string;
}
