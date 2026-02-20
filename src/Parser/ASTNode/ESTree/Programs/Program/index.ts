import ASTNode, { ASTNodeProps } from "../../NodeObjects/Node";
import { KEYWORD_TYPE, TokenType } from "../../../../../Lexer/consts";
import Token from "../../../../../Lexer/Token";
import { ASTNODE_TYPE } from "../../../../consts";
import PeekTokenIterator from "../../../../PeekTokenIterator";
import ImportOrExportDeclaration from "../../Modules/ImportOrExportDeclaration";
import Statement from "../../Statements/Statement";
import { SourceType } from "./types";

class Program extends ASTNode {
  // CJS还是ESM
  public sourceType: SourceType = SourceType.MODULE;
  // 存放内部代码的数组，内部的类型为  Statement | ImportOrExportDeclaration
  public body: (Statement | ImportOrExportDeclaration)[];
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.PROGRAM,
      label,
    });
  }
  static parse(iterator: PeekTokenIterator) {
    const program = new Program({ label: null });
    const body = [];
    while (iterator.hasNext()) {
      const token = iterator.peek();
      if (token === TokenType.EOF) break;
      const [type, value] = [token?.getType(), token?.getValue()];
      // import
      if (type === TokenType.KEYWORD && value === KEYWORD_TYPE.IMPORT) {
        body.push(ImportOrExportDeclaration.parse(iterator));
        // export
      } else if (type === TokenType.KEYWORD && value === KEYWORD_TYPE.EXPORT) {
        body.push(ImportOrExportDeclaration.parse(iterator));
      } else {
        body.push(Statement.parse(iterator));
      }
    }
    program.body = body;
    return program;
  }
}

export default Program;
