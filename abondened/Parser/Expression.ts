// @ts-nocheck
import { priorityTable } from "../consts";
import ASTNode, { ASTNODE_TYPE } from "./ASTNode";
import Scalar from "./Scalar";
import Variable from "./Variable";
import { TokenType } from "../Token";

class Expression extends ASTNode {
  constructor({ parent, label, type }: { parent: ASTNode | null; label: string | null; type: ASTNODE_TYPE }) {
    super({
      parent,
      type,
      label,
    });
  }
  static fromToken(parent, type, token) {
    const label = token?.getLabel?.() ?? token?.getValue?.() ?? null;
    const expr = new Expression({ parent, label, type });
    expr.lexeme = token;
    return expr;
  }
  static parseExpression(parent, it) {
    return Expression.parsePrecedence(parent, it, 0);
  }
  /**
   * Pratt 解析入口：解析优先级 >= minPrec 的表达式
   * 1) 先解析前缀（变量/常量/括号/一元）
   * 2) 再不断吃掉满足优先级的二元运算符，向右结合
   */
  static parsePrecedence(parent, it, minPrec) {
    if (!it.hasNext()) return null;
    let left = Expression.parsePrefix(parent, it);
    if (!left) return null;
    while (it.hasNext()) {
      const opToken = it.peek();
      const opValue = opToken?.getValue?.() ?? "";
      const prec = Expression.getPrecedence(opValue);
      if (prec < minPrec || prec === 0) break;
      it.next();
      const opNode = Expression.fromToken(parent, ASTNODE_TYPE.BINARY_OPERATOR, opToken);
      const right = Expression.parsePrecedence(opNode, it, prec + 1);
      opNode.addChild(left);
      if (right) {
        opNode.addChild(right);
      }
      left = opNode;
    }
    return left;
  }
  /**
   * 前缀解析（nud）
   * - 括号： ( expr )
   * - 一元： ++a / --a / !a
   * - 变量： token.type === VARIABLE
   * - 常量：数字/字符串/布尔/空等
   */
  static parsePrefix(parent, it) {
    const token = it.peek();
    const value = token?.getValue?.();
    if (value === "(") {
      it.nextMatch("(");
      const expr = Expression.parsePrecedence(parent, it, 0);
      it.nextMatch(")");
      return expr;
    }
    if (["++", "--", "!"].includes(value)) {
      const opToken = it.next();
      const expr = Expression.fromToken(parent, ASTNODE_TYPE.UNARY_OPERATOR, opToken);
      const right = Expression.parsePrecedence(expr, it, Expression.getUnaryPrecedence());
      if (right) {
        expr.addChild(right);
      }
      return expr;
    }
    if (token?.getType?.() === TokenType.VARIABLE) {
      return new Variable({ parent, iterator: it });
    }
    return new Scalar(parent, it);
  }
  /**
   * 返回运算符的优先级（数值越大，优先级越高）
   */
  static getPrecedence(op) {
    for (let i = 0; i < priorityTable.length; i += 1) {
      if (priorityTable[i].includes(op)) {
        return i + 1;
      }
    }
    return 0;
  }
  /**
   * 一元运算符优先级，设为高于所有二元运算符
   */
  static getUnaryPrecedence() {
    return priorityTable.length + 1;
  }
}

export default Expression;
