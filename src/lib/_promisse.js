const { PENDING, FULLFILLED, REJECT } = require("./_status");

class _MyPromisse {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = "";

    this.onFullFilledCBs = [];
    this.onRejectedCBs = [];

    const resolve = (value) => {
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
    const myPromise2 = new _MyPromisse((resolve, reject) => {
      if (this.status === FULLFILLED) {
        try {
          const x = onFullFilled(this.value);
          resolvePromise(myPromise2, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      }

      if (this.status === REJECT) {
        try {
          const x = onRejected(this.reason);
          resolvePromise(myPromise2, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      }

      if (this.status === PENDING) {
        this.onFullFilledCBs.push(() => {
          try {
            const x = onFullFilled(this.value);
            resolvePromise(myPromise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });

        this.onRejectedCBs.push(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(myPromise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }
    });
  }
}

module.exports = {
  _MyPromisse,
};
