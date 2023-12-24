const fs = require("fs");
const path = require("path");
const { MyPromisse } = require("../lib/index");

function readFile(path, delay) {
  return new MyPromisse((resolve, reject) => {
    setTimeout(() => {
      fs.readFile(path, "utf8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    }, delay);
  });
}

/**
 * 笨办法
 */
// const id = 1;
// let dataArr = [];
// dataArr.push(id);

// readFile(path.resolve(__dirname, "./mock/user.json")).then((res) => {
//   dataArr.push(res);

//   readFile(path.resolve(__dirname, "./mock/clss.json")).then((res) => {
//     dataArr.push(res);

//     console.log("来了老弟", dataArr);
//   });
// });

/**
 * 原始的
 */
MyPromisse.all([
  1,
  readFile(path.resolve(__dirname, "./mock/user.json"), 3000),
  readFile(path.resolve(__dirname, "./mock/clss.json"), 1000),
])
  .then((res) => {
    console.log("原生的", res);
  })
  .catch((err) => {
    console.log("报错啦", err);
  });
