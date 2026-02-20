import ASTNode, { ASTNodeProps } from "../..";
import { ASTNODE_TYPE } from "../../../consts";
import { ModuleSpecifierLocal } from "./types";

class ModuleSpecifier extends ASTNode {
  public local: ModuleSpecifierLocal;
  constructor({ label }: ASTNodeProps) {
    super({
      type: ASTNODE_TYPE.MODULE_SPECIFIER,
      label,
    });
  }
}

export default ModuleSpecifier;
