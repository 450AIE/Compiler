import ASTNode, { ASTNodeProps } from "..";
import { TokenType } from "../../../Lexer/consts";
import Token from "../../../Lexer/Token";
import { ASTNODE_TYPE, OPERATOR_BINDING_POWER } from "../../consts";
import PeekTokenIterator from "../../PeekTokenIterator";
import Factor from "../Factor";

class Expression extends ASTNode {
  constructor({ label, type }: ASTNodeProps) {
    super({
      type: type ?? ASTNODE_TYPE.EXPRESSION,
      label,
    });
  }
  /**
   * prattParse算法，解析表达式
   */
  static parse(iterator: PeekTokenIterator) {
    const expression = new Expression({ label: null });
    const root = Expression.prattParse(iterator, 0);
    expression.addChild(root);
    return expression;
  }
  private static prattParse(iterator: PeekTokenIterator, prevBindingPower: number) {
    // 左侧操作数，即 a + expression中的a，有可能是括号
    let leftNumToken = iterator.next() as Token;
    let leftNumFactorNode = Factor.parseToken(leftNumToken);
    const type = leftNumToken.getType();
    const value = leftNumToken.getValue();
    // 遇到左括号需要特殊处理
    if (type === TokenType.BRACKET && value === "(") {
      leftNumFactorNode = Expression.prattParse(iterator, 0);
      // 下面while内遇到）直接break了，所以这里next消费掉是）或者EOF，如果是EOF，那么就缺失右括号
      const closingToken = iterator.next() as Token;
      if (closingToken?.getValue() !== ")") throw new Error(`Unexpected Token: 缺失右侧括号`);
    }
    // 暂时只运算number和变量
    // @ts-expect-error
    if (![TokenType.NUMBER, TokenType.VARIABLE, TokenType.BRACKET].includes(type)) {
      throw new Error(`Unexpected Token: ${leftNumToken}`);
    }
    while (true) {
      // 获取操作符
      const operatorToken = iterator.peek();
      if (operatorToken === TokenType.EOF) break;
      const op = operatorToken.getValue();
      // 暂时只支持二元计算，并且操作符需要是一个节点，才可以将左右操作数addChild
      const opASTNode = new Expression({ label: op, lexme: operatorToken, type: ASTNODE_TYPE.BINARY_OPERATOR });
      if (op === ")") break;
      // 没有结合力，代表没有收录这个运算符，或者这个就不是运算符
      if (!OPERATOR_BINDING_POWER[op]) throw new Error(`暂未支持该运算符: ${op}`);
      // 获取该运算符的左右结合力
      const [leftPower, rightPower] = OPERATOR_BINDING_POWER[op];
      // 对于 1 + 3 * 2，这里如果leftNumToken是3的话，那么传递的形参prevBindingPower就是3前面的+的右结合力11，leftPower
      // 就是3后面的*的左结合力20，谁更大，3就跟谁走，如果前面更大，就break掉直接把3给return出去。这个意思
      if (leftPower < prevBindingPower) break;
      // 消费掉这个运算符
      iterator.next();
      const rightNumNode = Expression.prattParse(iterator, rightPower);
      // 拼接为AST
      opASTNode.addChild(leftNumFactorNode);
      opASTNode.addChild(rightNumNode);
      leftNumFactorNode = opASTNode;
    }
    return leftNumFactorNode;
  }
}

export default Expression;
