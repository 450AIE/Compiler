import ImportOrExportDeclaration from "..";
import { ASTNodeProps } from "../../../NodeObjects/Node";
import { ASTNODE_TYPE } from "../../../../../consts";
import PeekTokenIterator from "../../../../../PeekTokenIterator";

class ExportDeclaration extends ImportOrExportDeclaration {
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.EXPORT_DECLARATION,
      label,
    });
  }
  static parse(iterator: PeekTokenIterator) {
    const exportDeclaration = new ExportDeclaration({ label: null });
    return exportDeclaration;
  }
}

export default ExportDeclaration;
