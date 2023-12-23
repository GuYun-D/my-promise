const { MyPromisse } = require("./lib/index");

const promise = new MyPromisse((resolve, reject) => {
  //   resolve(1);
  //   reject("ERROR");
  //   throw new Error("你妹的");
  setTimeout(() => {
    resolve("success");
  }, 2000);
});

const promise1 = promise
  .then()
  .then()
  .then(
    (res) => {
      console.log("成功了", res);
      return new Promise((resolve, reject) => {
        reject("上一层失败了");
      });
    },
    (error) => {
      console.log("失败了", error);
    }
  );

promise1
  .then((res) => {
    console.log("第二个then成功", res);
  })
  .catch((error) => {
    console.log("promise reject", error);
  });
