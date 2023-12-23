# my promise

## catch 也是遵循 then 的规则的

## 比较

```js
let promise2 = promise
  .then((value) => {
    // return undefined
  })
  .then((value) => {
    // return undefined
  });

// 和

let promise2 = promise.then(() => {
  // return undefined
});

promise2.then(() => {});
```

这两个当然是有区别的，第一个的结果是第二个 then 返回的结果

后面一个是第一次返回的 promise 的结果

## 穿透

promise 还允许那连个回调函数不传

```js
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
```

## 构造函数中还有 new Promise 时间

```js
const promise = new MyPromisse((resolve, reject) => {
  //   resolve(1);
  //   reject("ERROR");
  //   throw new Error("你妹的");
  // setTimeout(() => {
  //   resolve("success");
  // }, 2000);

  resolve(
    new MyPromisse((resolve, reject) => {
      setTimeout(() => {
        resolve("来了小老弟");
      }, 2000);
    })
  );
});
```

只需要添加下面的代码即可

```js
if (value instanceof _MyPromisse) {
  value.then(resolve, reject);
  return;
}
```
