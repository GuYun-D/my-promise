/**
 * finally无论外面的promise是成功过还是失败，都要走并且回调不带参数
 * 正常走finally之后的then或者catch
 * 如果finaly内部有promise或者延时，整个finally会等待
 * 如果两个都是成功，取外面的结果
 * 如果外面是成功，里面是失败，取里面的结果（失败）
 * 如果外面是成功，里面是成功，那就取外面的结果（成功）
 * 如果外面是失败，里面是成功，取外面的结果（失败）
 * 如果外面是失败，里面是失败，那就取里面的结果(失败)
 */

const { MyPromisse } = require("../lib/index");

MyPromisse.reject("外面的")
  .finally(() => {
    MyPromisse.reject("里面的");
  })
  .then((res) => {
    console.log("结果成功数据", res);
  })
  .catch((error) => {
    console.log("结果失败原因", error);
  });
