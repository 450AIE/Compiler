import ASTNode, { ASTNodeProps } from "../../NodeObjects/Node";
import { ASTNODE_TYPE } from "../../../../consts";
import PeekTokenIterator from "../../../../PeekTokenIterator";
import { KEYWORD_TYPE, TokenType } from "../../../../../Lexer/consts";
import Token from "../../../../../Lexer/Token";

let ImportDeclaration: any;
let ExportDeclaration: any;

const setImportDeclaration = (value: any) => {
  ImportDeclaration = value;
};

const setExportDeclaration = (value: any) => {
  ExportDeclaration = value;
};

/**
 * 导入导出声明，导入我暂时只支持
 * import a from 'b'
 * import { a, b } from 'c'
 *
 * 导出我暂时只支持
 * export { a, b }
 * export default a
 */
class ImportOrExportDeclaration extends ASTNode {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.IMPORT_OR_EXPORT_DECLARATION,
      label,
    });
  }
  static parse(iterator: PeekTokenIterator) {
    const token = iterator.peek() as Token;
    const [type, value] = [token?.getType(), token?.getValue()];
    if (type === TokenType.KEYWORD && value === KEYWORD_TYPE.IMPORT) {
      return ImportDeclaration.parse(iterator);
    }
    if (type === TokenType.KEYWORD && value === KEYWORD_TYPE.EXPORT) {
      return ExportDeclaration.parse(iterator);
    }
    throw new Error(`Unexpected Token: ${token}`);
  }
}

export default ImportOrExportDeclaration;
export { setImportDeclaration, setExportDeclaration };
