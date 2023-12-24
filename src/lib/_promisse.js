const { PENDING, FULLFILLED, REJECT } = require("./_status");
const { _resolvePromise } = require("./_resolvePromise");

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
    function isPromise(x) {
      if ((typeof x === "object" && x !== null) || typeof x === "function") {
        let then = x.then;
        return typeof then === "function";
      }

      return false;
    }

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
}

module.exports = {
  _MyPromisse,
};
