const PENDING = "PENDING";
const FULLFILLED = "FULLFILLED";
const REJECT = "REJECT";

class MyPromisse {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = "";

    const resolve = (value) => {
      if (this.status === PENDING) {
        this.value = value;
        this.status = FULLFILLED;
      }
    };

    const reject = (reason) => {
      this.status = REJECT;
      this.reason = reason;
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFullFilled, onReject) {
    if (this.status === FULLFILLED) {
      onFullFilled(this.value);
    }

    if (this.status === REJECT) {
      onReject(this.reason);
    }
  }
}

module.exports = {
  MyPromisse,
};
