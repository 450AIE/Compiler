import ImportOrExportDeclaration from "..";
import { ASTNodeProps } from "../..";
import { ASTNODE_TYPE } from "../../../consts";
import PeekTokenIterator from "../../../PeekTokenIterator";

class ImportDeclaration extends ImportOrExportDeclaration {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.IMPORT_DECLARATION,
      label,
    });
  }
  static parse(iterator: PeekTokenIterator) {
    const importDeclaration = new ImportDeclaration({ label: null });
    return importDeclaration;
  }
}

export default ImportDeclaration;
