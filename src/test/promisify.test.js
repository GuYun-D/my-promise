const fs = require("fs");
const { promisify, promisifyAll } = require("../lib/index");

const readFileAsync = promisify(fs.readFile);

readFileAsync("../mock/clss.json", "utf8")
  .then((res) => {
    console.log("文件数据", res);
  })
  .catch((error) => {
    console.log("读取报错了", error);
  });
