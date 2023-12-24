const { _MyPromisse } = require("./_promisse");
const { promisify, promisifyAll } = require("./_utils");
module.exports = {
  MyPromisse: _MyPromisse,
  promisify,
  promisifyAll,
};
