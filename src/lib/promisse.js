const PENDING = "PENDING";
const FULLFILLED = "FULLFILLED";
const REJECT = "REJECT";

class MyPromisse {
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
    if (this.status === FULLFILLED) {
      onFullFilled(this.value);
    }

    if (this.status === REJECT) {
      onRejected(this.reason);
    }

    if (this.status === PENDING) {
      this.onFullFilledCBs.push(() => {
        onFullFilled(this.value);
      });

      this.onRejectedCBs.push(() => {
        onRejected(this.reason);
      });
    }
  }
}

module.exports = {
  MyPromisse,
};
