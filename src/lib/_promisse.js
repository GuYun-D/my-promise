const { PENDING, FULLFILLED, REJECT } = require("./_status");
const { _resolvePromise } = require("./_resolvePromise");
const { isIterabe, isPromise } = require("./_utils");

class _MyPromisse {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = "";

    this.onFullFilledCBs = [];
    this.onRejectedCBs = [];

    const resolve = (value) => {
      if (value instanceof _MyPromisse) {
        value.then(resolve, reject);
        return;
      }

      if (this.status === PENDING) {
        this.value = value;
        this.status = FULLFILLED;
        this.onFullFilledCBs.forEach((fn) => fn());
      }
    };

    const reject = (reason) => {
      this.status = REJECT;
      this.reason = reason;
      this.onRejectedCBs.forEach((fn) => fn());
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFullFilled, onRejected) {
    onFullFilled =
      typeof onFullFilled === "function" ? onFullFilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    const myPromise2 = new _MyPromisse((resolve, reject) => {
      if (this.status === FULLFILLED) {
        /**
         * 将这段代码转换成异步执行的，这是Promise A+的规范的内容
         * 这样我们也可以是确保promise2的状态
         */
        setTimeout(() => {
          try {
            const x = onFullFilled(this.value);
            _resolvePromise(myPromise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      if (this.status === REJECT) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            _resolvePromise(myPromise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      if (this.status === PENDING) {
        this.onFullFilledCBs.push(() => {
          setTimeout(() => {
            try {
              const x = onFullFilled(this.value);
              _resolvePromise(myPromise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });

        this.onRejectedCBs.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              _resolvePromise(myPromise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });

    return myPromise2;
  }

  /**
   * 使用then模拟catch方法
   */
  catch(errorCB) {
    this.then(null, errorCB);
  }

  finally(finallyCB) {
    return this.then(
      (value) => {
        return _MyPromisse.resolve(finallyCB()).then(() => value);
      },
      (reason) => {
        return _MyPromisse.resolve(finallyCB()).then(() => {
          throw reason;
        });
      }
    );
  }

  static resolve(value) {
    return new _MyPromisse((resolve, reject) => {
      resolve(value);
    });
  }

  static reject(error) {
    return new _MyPromisse((resolve, reject) => {
      reject(error);
    });
  }

  static all(promiseArr) {
    let resArr = [];
    let count = 0;

    function formatRes(value, index, resolve) {
      resArr[index] = value;
      if (++count === promiseArr.length) {
        resolve(resArr);
      }
    }

    return new _MyPromisse((resolve, reject) => {
      promiseArr.map((promise, index) => {
        if (isPromise(promise)) {
          promise.then((res) => {
            formatRes(res, index, resolve);
          }, reject);
        } else {
          formatRes(promise, index, resolve);
        }
      });
    });
  }

  static allSettled(promiseArr) {
    const resArr = [];
    let count = 0;

    if (!isIterabe(promiseArr)) {
      throw new TypeError(
        `${promiseArr} is not iterable (cannot read property Symbol(Symbol.iterator))`
      );
    }

    function formatResArr(status, value, index, resolve) {
      switch (status) {
        case "fulfilled":
          resArr[index] = {
            status,
            value,
          };
          break;

        case "rejected":
          resArr[index] = {
            status,
            reason: value,
          };
          break;

        default:
          break;
      }

      if (++count === promiseArr.length) {
        resolve(resArr);
      }
    }

    return new _MyPromisse((resolve, reject) => {
      if (promiseArr.length === 0) {
        resolve([]);
      }

      promiseArr.map((promise, index) => {
        if (isPromise(promise)) {
          promise.then(
            (value) => {
              formatResArr("fulfilled", value, index, resolve);
            },
            (reason) => {
              formatResArr("rejected", reason, index, resolve);
            }
          );
        } else {
          formatResArr("fulfilled", promise, index, resolve);
        }
      });
    });
  }

  static race(promiseArr) {
    return new _MyPromisse((resolve, reject) => {
      promiseArr.forEach((promise) => {
        if (isPromise(promise)) {
          promise.then(resolve, reject);
        } else {
          resolve(promise);
        }
      });
    });
  }
}

module.exports = {
  _MyPromisse,
};
