import ImportOrExportDeclaration from "..";
import { ASTNodeProps } from "../../../NodeObjects/Node";
import { KEYWORD_TYPE, TokenType } from "../../../../../../Lexer/consts";
import { ASTNODE_TYPE } from "../../../../../consts";
import PeekTokenIterator from "../../../../../PeekTokenIterator";

class ImportDeclaration extends ImportOrExportDeclaration {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.IMPORT_DECLARATION,
      label,
    });
  }
  /**
   * 导入我暂时只支持
   * import a from 'b'
   * import { a, b } from 'c'
   */
  static parse(iterator: PeekTokenIterator) {
    const importDeclaration = new ImportDeclaration({ label: null });
    iterator.nextTokenMatchByValue(KEYWORD_TYPE.IMPORT);
    while (iterator.hasNext()) {
      const token = iterator.peek();
      if (token === TokenType.EOF) break;
      const [type, value] = [token.getType(), token.getValue()];
    }
    return importDeclaration;
  }
}

export default ImportDeclaration;
