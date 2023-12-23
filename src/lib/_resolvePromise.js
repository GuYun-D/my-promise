/**
 * 核心就是判断x是否是一个promise
 * @param {_MyPromisse} promise2
 * @param {any} x
 * @param {Function} resolve
 * @param {Function} reject
 */
const _resolvePromise = (promise2, x, resolve, reject) => {
  /***
   * 如果这个当前的promise 在 return 的时候是自己那么就会报错
   * const testPromise = prePromise.then((res) => { return testPromise })
   */
  if (promise2 === x) {
    return reject(
      new TypeError("Chaining cycle detected for promise #<MyPromise>")
    );
  }

  let called = false;

  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    try {
      const then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            /**
             * 递归调用
             */
            // resolve(y);

            _resolvePromise(promise2, y, resolve, reject); // 这样就可以实现一个链式调用了
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    // 普通的值
    resolve(x);
  }
};

module.exports = {
  _resolvePromise,
};
