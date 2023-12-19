const { MyPromisse } = require("./lib/promisse");

const promise = new MyPromisse((resolve, reject) => {
  //   resolve(1);
  //   reject("ERROR");
  //   throw new Error("你妹的");
  setTimeout(() => {
    resolve("success");
  }, 2000);
});

promise.then(
  (res) => {
    console.log("成功了", res);
  },
  (error) => {
    console.log("失败了", error);
  }
);
