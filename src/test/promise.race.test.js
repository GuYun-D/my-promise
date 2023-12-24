const { MyPromisse } = require("../lib/index");

const p1 = new MyPromisse((resolve, reject) => {
  setTimeout(() => {
    reject("p1 ~~~~");
  }, 1000);
});

const p2 = new MyPromisse((resolve, reject) => {
  setTimeout(() => {
    resolve("p2 ~~~~");
  }, 5000);
});

MyPromisse.race([p1, p2])
  .then((res) => {
    console.log("成功了", res);
  })
  .catch((error) => {
    console.log("失败了", error);
  });
