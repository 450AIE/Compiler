class AlphabetChecker {
  // 单字符
  static letterRegExp = /[a-zA-Z]/;
  // 数字
  static numberRegExp = /[0-9]$/;
  // 合法的非首字母的变量名字符
  static identifierNotFirstCharRegExp = /^[a-zA-Z0-9_]$/;
  static identifierFirstCharRegExp = /^[_a-zA-Z]$/;
  // 操作符
  static opeartorRegExp = /^[+\-*/=><!&|^~]$/;
  static isLetter(char: string) {
    return this.letterRegExp.test(char);
  }
  static isNumber(char: string) {
    return this.numberRegExp.test(char);
  }
  static isIdentifierNotFirstCharRegExp(char: string) {
    return this.identifierNotFirstCharRegExp.test(char);
  }
  static isIdentifierFirstCharRegExp(char: string) {
    return this.identifierFirstCharRegExp.test(char);
  }
  static isOperator(char: string) {
    return this.opeartorRegExp.test(char);
  }
}

export default AlphabetChecker;
