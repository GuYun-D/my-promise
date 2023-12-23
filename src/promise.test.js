const { MyPromisse } = require("../src/lib/index");

MyPromisse.defer = MyPromisse.deferred = function () {
  let deferred = {};

  deferred.promise = new MyPromisse((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  return deferred;
};

module.exports = MyPromisse;
