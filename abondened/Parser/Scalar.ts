import Factor from "./Factor";

import PeekTokenIterator from "./PeekTokenIterator";

/**
 * 标量，即常量
 */
class Scalar extends Factor {
  constructor(parent, it: PeekTokenIterator) {
    super(parent, it);
  }
}

export default Scalar;
