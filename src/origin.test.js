const promise = new Promise((resolve, reject) => {
  //   resolve(1);
  //   reject("ERROR");
  //   throw new Error("你妹的");
  setTimeout(() => {
    resolve("success");
  }, 2000);
});

const promise1 = promise.then(
  (res) => {
    console.log("成功了", res);
    throw new Error("你妹的");
  },
  (error) => {
    console.log("失败了", error);
  }
);

promise1
  .then()
  .then()
  .then()
  .then(
    (a) => {
      console.log("成功了", a);
    },
    (b) => {
      console.log("失败了", b);
    }
  );
