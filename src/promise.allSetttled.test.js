const { MyPromisse } = require("../src/lib/index");

const p1 = new MyPromisse((resolve, reject) => {
  resolve("success");
});

const p2 = new MyPromisse((resolve, reject) => {
  reject("error");
});

MyPromisse.allSettled([p1, p2])
  .then((res) => {
    console.log("成功了", res);
  })
  .catch((error) => {
    console.log("失败了", error);
  });
