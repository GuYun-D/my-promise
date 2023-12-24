/**
 * 判断当前是否是一个peomise
 */
function isPromise(x) {
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    let then = x.then;
    return typeof then === "function";
  }

  return false;
}

/**
 * 判断当前是否是一个可迭代对象
 */
function isIterabe(value) {
  return (
    value !== null &&
    value !== undefined &&
    typeof value[Symbol.iterator] === "function"
  );
}

module.exports = {
  isIterabe,
  isPromise,
};
