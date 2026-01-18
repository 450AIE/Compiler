/**
 * 用来检查字符的词性
 */
class AlphabetChecker {
  static letterRegExp = /[a-zA-Z]/;
  static numberRegExp = /[0-9]$/;
  static literalRegExp = /^[a-zA-Z0-9_]$/;
  static opeartorRegExp = /^[+\-*/=><!&|^~]$/;

  static isLetter(char: string) {
    return this.letterRegExp.test(char);
  }
  static isNumber(char: string) {
    return this.numberRegExp.test(char);
  }
  static isLiteral(char: string) {
    return this.literalRegExp.test(char);
  }
  static isOperator(char: string) {
    return this.opeartorRegExp.test(char);
  }
}

export default AlphabetChecker;
