import Token from "../../Lexer/Token";
import { ASTNODE_TYPE } from "../consts";

export interface ASTNodeProps {
  parent?: ASTNode | null;
  type?: ASTNODE_TYPE;
  label: string | null;
  lexme?: Token | null;
}

class ASTNode {
  public children: ASTNode[];
  public parent?: ASTNode | null;
  public type?: ASTNODE_TYPE;
  public label: string | null;
  public lexme: Token | null;
  constructor({ parent, type, label, lexme }: ASTNodeProps) {
    this.children = [];
    this.parent = parent ?? null;
    this.type = type;
    this.label = label ?? null;
    this.lexme = lexme ?? null;
  }
  getChildren() {
    return this.children;
  }
  addChild(child: ASTNode) {
    if (child) {
      child.parent = this;
    }
    this.children.push(child);
  }
  getLexeme() {
    return this.lexme;
  }
  getType() {
    return this.type;
  }
  getLabel() {
    return this.label;
  }
  getParent() {
    return this.parent;
  }
}

export default ASTNode;
