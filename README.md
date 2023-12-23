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
