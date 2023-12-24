const { _MyPromisse } = require("./_promisse");

/**
 * 判断当前是否是一个peomise
 */
function isPromise(x) {
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    let then = x.then;
    return typeof then === "function";
  }

  return false;
}

/**
 * 判断当前是否是一个可迭代对象
 */
function isIterabe(value) {
  return (
    value !== null &&
    value !== undefined &&
    typeof value[Symbol.iterator] === "function"
  );
}

/**
 * 将回调方式改造成promise函数
 */
function promisify(fn) {
  return function (...args) {
    return new _MyPromisse((resolve, reject) => {
      fn(...args, (error, data) => {
        if (error) {
          return reject(error);
        }

        resolve(data);
      });
    });
  };
}

/**
 * 将一个对象中的所有方法都转换成promise
 */
function promisifyAll(fns) {
  Object.keys(fns).forEach((fnname) => {
    if (typeof fns[fnname] === "function") {
      fns[fnname + "Async"] = promisify(fns[fnname]);
    }
  });
}

module.exports = {
  isIterabe,
  isPromise,
  promisify,
  promisifyAll,
};
