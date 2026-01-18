export const ASTNODE_TYPE = {
  BLOCK: "BLOCK",
  BINARY_OPERATOR: "BINARY_OPERATOR",
  UNARY_OPERATOR: "UNARY_OPERATOR",
  VARIABLE: "VARIABLE",
  IF_STATEMENT: "IF_STATEMENT",
  ELSE_STATEMENT: "ELSE_STATEMENT",
  FOR_STATEMENT: "FOR_STATEMENT",
  ASSIGNMENT_STATEMENT: "ASSIGNMENT_STATEMENT",
  FUNCTION_DECLARE_STATEMENT: "FUNCTION_DECLARE_STATEMENT",
  SCALAR: "SCALAR",
} as const;

export type ASTNODE_TYPE = (typeof ASTNODE_TYPE)[keyof typeof ASTNODE_TYPE];

class ASTNode {
  children: ASTNode[] = [];
  parent: ASTNode | null = null;
  type: ASTNODE_TYPE;
  label: string | null = null;
  lexeme: string | null = null;
  constructor({
    parent,
    type,
    label,
    lexeme = null,
  }: {
    parent: ASTNode | null;
    type: ASTNODE_TYPE;
    label: string | null;
    lexeme?: string | null;
  }) {
    this.parent = parent;
    this.type = type;
    this.label = label;
    this.lexeme = lexeme;
  }
  getChildren() {
    return this.children;
  }
  addChild(child: ASTNode) {
    this.children.push(child);
  }
  getLexeme() {
    return this.lexeme;
  }
  getType() {
    return this.type;
  }
  getLabel() {
    return this.label;
  }
}

export default ASTNode;
