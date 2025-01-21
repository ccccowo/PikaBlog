---
title: 面试JS手写题汇总
date: 2025-01-20 16:30:00
categories:
  - 面试准备
  - 刷题
tags:
  - 面试
---

> 记录一下准备面试的过程中学习和积累的一些JS手写题，写的过程也是对自己学习的一个输出，在写文章的过程中同时也发现了一些不足，继续努力！🎉全文代码都打上了详细注释，可放心食用！
## 防抖

防抖是指在一个函数被频繁触发时，只有在最后一次触发后的指定时间内没有再次被触发，才会执行该函数。也就是说，防抖会“等待”一段时间以确保在这段时间内函数没有被再次调用，然后才执行它。


大概步骤如下：
1. 函数被触发时，记录当前的`this`
2. 判断该函数是否在等待执行，如果正在等待执行，则清除定时器
3. 重新创建定时器
4. 在定时器中执行该函数

```js
function devounce(fn,t){
  let timer = null
  // args用来记录调用函数时的传参
  return function(...args){
    // 记录当前this
    const context = this
    if(timer) clearTimeout(timer)
    timer = setTimeout(()=>{
      fn.apply(context,args)
    },t)
  }
}
```

## 节流
节流是指在一定时间内只执行一次函数，如果在这段时间内再次触发函数，则不会执行。与防抖不同，节流不等待最后一次触发后的时间，而是保证在固定的时间间隔内只执行一次函数。

大致步骤如下：

1. 函数被触发时，记录当前的`this`
2. 判断该函数在固定时间间隔中是否执行完毕（即`timer==null`为执行完毕)
3. 若执行完毕，则重新开启定时器
4. 在定时器中执行该函数，并在函数执行完毕后将`timer=null`

```js
function throttle(fn,t){
    let timer = null
    return function(...arge){
        const context = this
        if(timer === null)
            timer = setTimeout(()=>{
                fn.apply(context,args)
                timer = null
            },t)
    }
}
```

## 浅拷贝

```js
//对象浅拷贝
//1.利用展开运算符
const o = {...obj}
// 2.利用Object.assign(新对象，原对象)
Object.assign(o1,obj)
// 3.Object.create(原对象)
const o2 = Object.create(obj)

//数组浅拷贝
// 4.[].concat() 可以将一个或多个数组合并为一个新数组
const arr = [1,2,3]
let a1 = [].concat(arr)
// 5.arr.slice() 参数为空时则返回整个数组
let a2 = arr.slice()
```

## 深拷贝

```js
// 1.递归实现
function deepClone(obj){
    // 基本数据类型
    if((obj instanceof Object) === flase) return
    // 如果是数组就创建数组，是对象就创建对象
    let newObj = obj instanceof Array ? [] : {}
    for(let key in obj){
        // 判断是不是对象自有属性
        if(obj.hasOwnProperty(key)){
            newObj[key] = deepClone(obj[key])
        }
    }
    return newObj
}

// 2.JSON实现
function deepClone2(obj){
    return JSON.parse(JSON.stringify(obj))
}

```
## 函数柯里化

```js
// 函数柯里化
function curry(fn,...args1){
    // 如果传进来的参数个数大于等于所需要的参数个数，则直接返回执行函数
    if(args1.length >= fn.length) return fn(...args1)
    else{
        return function(...args2){
            // 合并原有的参数和新传入的参数
            return curry(fn,...args1,...args2)
        }
    }
}
```

## new
new做了哪些事情呢

1. 创建一个新的对象
2. 继承父类原型上的方法
3. 添加父类的属性到新的对象上并初始化，保存方法的返回结果
4. 如果返回结果是一个对象，则返回这个对象；否则返回新创建的对象


```js
function Mynew(constructor,...args){
    let obj = {}
    obj.__proto__ = constructor.prototype
    let result = constructor.apply(obj,args)
    return result instanceof Object ? result : obj
}
```

## call、apply和bind

`call`
1. 方法是绑定在`Function`的原型对象上的
2. 判断调用`call`的对象是否是函数，不是则报错
3. 判断`this`所要指向的对象是否存在，不存在则指向window
4. 使用`Symbol`创建新的属性
5. 将函数绑定到目标对象的新属性中
6. 传入参数进行函数的调用
7. 删除新增的属性

`apply`

1. apply和call十分相似，不同之处在于传入的参数是数组
2. 所以需要对数组进行一个处理

`bind`

1. `bind`不会马上调用函数，所以需要返回一个函数
2. 在返回的函数中进行改变目标对象后的函数的调用
```js
// call
Function.prototype.myCall = function(target,...args){
    // 判断调用myCall的是否是函数
    if(typeof this !== 'function'){
        throw new TypeError("myCall被调用的对象必须是函数")
    }
    // 如果没有目标对象，默认为window
    target = target || window
    // 使用symbol来创建唯一的symbolKey,防止名字冲突
    const symbolKey = new Symbol()
    // this是调用myCall的函数，将函数绑定到目标对象的新属性中
    target[symbolKey] = this
    // 传入myCall的参数
    let result = target[symbolKey](...args)
    // 删除新增的symbolKey
    delete target[symbolKey]

    return result
}


// apply
Function.prototype.myApply = function(target,args){
    if(typeof this !== 'function'){
        throw new TypeError("myApply被调用的对象必须是函数")
    }
    // 判断传入的参数是否是数组
    if(args && Array.isArray(args) === false){
        throw new TypeError("第二个参数必须是数组")
    }
    // 如果第二个参数省略或者为空则赋值空数组
    args = args || []
    target = target || window
    symbolKey = new Symbol()
    target[symbolKey] = this
    let result = target[symbolKey](...args)
    delete target[symbolKey]
    return result
}



// bind
Function.prototype.myBind = function(target,...args1){
    if(typeof this !== 'function'){
        throw new TypeError("myApply被调用的对象必须是函数")
    }
    target = target || window
    symbolKey = new Symbol()
    target[symbolKey] = this

    // 返回一个函数
    return function(...args2){
        let result = target[symbolKey](...args1,...args2)
        return result
    }
}
```
# Promise相关
## Promise.all

```js
function myPromiseAll(promiseArray) {
    // 确保传入的是一个数组
    if (!Array.isArray(promiseArray)) {
        return Promise.reject(new Error('不是数组'))
    }
    
    // 返回一个Promise对象
    return new Promise((resolve, reject) => {
        let completed = 0
        let result = []
        for (let promise of promiseArray) {
            // 确保每个元素都是promise对象
            // Promise.resolve(value) 是一个静态方法
            // 用于将一个值或者一个可能是 Promise 的值转换成一个确定的 Promise 对象
            promise = Promise.resolve(promise)
            promise.then(value => {
                completed++
                result.push(value)
                // 全部完成后返回结果
                if (completed === promiseArray.length) {
                    resolve(result)
                }
            }, reason => {
                // 如果有任何一个promise失败,则立即reject
                reject(reason)
            })
        }
    })
}

myPromiseAll([
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3)
]).then(values => {
    console.log(values); // 输出 [1, 2, 3]  
})
```

## Promise.race


```js
// promise.race
function myPromiseRace(promiseArray) {
    // 确保传入的是一个数组
    if (!Array.isArray(promiseArray)) {
        return Promise.reject(new Error('不是数组'))
    }

    // 返回一个Promise对象
    return new Promise((resolve, reject) => {
        for (let i = 0; i < promiseArray.length; i++) {
            // 确保是一个Promise对象
            let promise = Promise.resolve(promiseArray[i])

            promise.then(
                value => {
                    resolve(value)
                },
                reason => {
                    reject(reason)
                })
        }
    })
}
```
## Promise.resolve / Promise.reject

```js
// Promise.resolve
function myPromiseResolve(value){
    if(value instanceof Promise) return value
    else return new Promise(resolve => resolve(value))
}

// Promise.reject
// Promise.reject会实例化一个rejected状态的Promise，但与Promise.resolve（）不同
//如果给Promise.reject()传递一个Promise对象，这个对象会成为新的Promise的值
function myPromiseReject(reason){
    return new Promise((resolve,reject)=>reject(reason))
}
```
# 类型检测
## instanceof

```js
// instanceof
function myInstanceof(obj,constructor){
    // 如果obj是非对象则直接返回false
    if(!(obj instanceof Object))
        return false
    // 如果constructor是非构造函数或者没有prototype属性则直接返回false
    if(typeof constructor != 'function' || !constructor.prototype){
        return false
    }
    let left = obj.__prop__
    const right = constructor.prototype
    while(true){
        if(left === null) return false
        if(left === right) return true
        // 沿着原型链往上
        left = left.__proto__
    }
    return false
}
```
## typeof

```js
// 手写typeof
function myTypeof(obj){
    return Object.prototype.toString.call(obj).slice(8,-1).toLowerCase()
}
```


# 数组操作
## 数组分类

```js
// 数组分类
Array.prototype.group = function (fn) {
    let result = {}
    for (let i = 0; i < this.length; i++) {
        let key = fn(this[i])
        result[key] ? result[key].push(this[i]) : result[key] = [this[i]]
    }
    return result
}
let arr = [1, 2, 3, 4, 5, 6]
let obj = arr.group((item) => {
    return item % 2 === 0 ? '偶数' : '奇数'
})

console.log(obj)
// obj = {
//     "偶数":[2,4,6],
//     "奇数":[1,3,5]
// }

```

## 数组扁平化

```js
// 数组扁平化
const arr = [1, 2, [1, 2, 3, [4, 5, 6]]]

// 1.flat
let arr1 = arr.flat(Infinity)

// 2.reduce
function flatten1(arr) {
    return arr.reduce((pre, cur) => {
        return pre.concat(Array.isArray(cur) ? flatten1(cur) : cur)
    }, [])
}

// 3.普通递归实现
function flatten2(arr) {
    let result = []
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            // 递归展平数组拼接到结果数组
            result = result.concat(flatten1(arr[i]))
        } else {
            result.push(arr[i])
        }
    }
    return result
}
```
# 手写数组方法
1. 方法应该挂载在`Array`的`prototype`上
2. 方法接收一个回调函数，大多数数组操作方法会接收一个新的`this`指向（下面代码中用`thisArg`接收）
3. 先判断调用此方法的对象是不是一个数组
4. 再判断`callback`参数接收的是不是一个函数
5. 循环遍历数组，在循环中使用`call`方法来调用`callback`，并传入四个参数（`callback`函数中的指向，遍历到的数组元素，遍历到的数组下标，原数组）
6. 根据相应的数组操作决定是否有返回值，返回什么
## forEach

```js
// 手写forEach
Array.prototype.myForEach = function(callback,thisArg){
    // 确保数组是一个数组
    if(this instanceof Array === false){
        throw new Error("myForEach只能被数组调用")
    }
    // 确保回调函数是一个函数
    if(typeof callback != 'function'){
        throw new TypeError("myForEach requires a function as the argument")
    }

    for(let i = 0;i < this.length;i++){
        // 调用回调函数，并传入当前元素、索引和原始数组
        // 如果提供了thisArg,则将其作为回调函数中的this值
        callback.call(thisArg || this,this[i],i,this)
    }
}
```
## map

```js
 Array.prototype.myMap = function(callback,thisArg){
    // 确保数组是一个数组
    if(this instanceof Array === false){
        throw new Error("myMap只能被数组调用")
    }
    // 确保回调函数是一个函数
    if(typeof callback != 'function'){
        throw new TypeError("myMap requires a function as the argument")
    }
    let result = []
    for(let i = 0;i < this.length;i++){
        result[i] = callback.call(thisArg || this,this[i],i,this)
    }
    return result
}
```

## filter

```js
// 手写filter
Array.prototype.myFilter = function(callback,thisArg){
    // 确保数组是一个数组
    if(this instanceof Array === false){
        throw new Error("myFilter只能被数组调用")
    }
    // 确保回调函数是一个函数
    if(typeof callback != 'function'){
        throw new TypeError("myFilter requires a function as the argument")
    }
    let result = []
    for(let i = 0;i < this.length;i++){
        // 调用回调函数，并传入当前元素、索引和原始数组
        // 如果提供了thisArg,则将其作为回调函数中的this值
        let flag = callback.call(thisArg || this,this[i],i,this)
        if(flag) result.push(this[i])
    }
    return result
}
```
## some

```js
 Array.prototype.mySome = function(callback,thisArg){
    // 确保数组是一个数组
    if(this instanceof Array === false){
        throw new Error("mySome只能被数组调用")
    }
    // 确保回调函数是一个函数
    if(typeof callback != 'function'){
        throw new TypeError("mySome requires a function as the argument")
    }

    for(let i = 0;i < this.length;i++){
        // 调用回调函数，并传入当前元素、索引和原始数组
        // 如果提供了thisArg,则将其作为回调函数中的this值
        let flag = callback.call(thisArg || this,this[i],i,this)
        if(flag) return true
    }
    return false
}
```
## reduce

```js
Array.prototype.myReduce = function(callback,initialValue){
    // 确保数组是一个数组
    if(!(this instanceof Array)){
        throw new Error("myReduce只能被数组调用")
    }
    // 确保回调函数是一个函数
    if(typeof callback != 'function'){
        throw new TypeError("myReduce requires a function as the argument")
    }
    let startIndex = 0,sum = arguments.length > 1? initialValue : undefined
    // 没有传初始值时
    if(arguments.length === 1){
        if(this.length === 1) throw new Error("Reduce of empty array with no initial value")
        startIndex = 1
        sum = this[0]
    }

    for(let i = startIndex;i < this.length;i++){
        sum = callback.call(this,sum,this[i],this)
    }
    return sum
}
```
## 虚拟DOM转真实DOM

```js
// 虚拟DOM转化为真实的DOM结构
const vnode = {
    tag:'div',
    attrs:{ id:'myDiv' },
    children:[
        123,
        "123456",
        { tag:'div',children:['Hello'] },
        { tag:'span',children:['World'] }
    ]
}
function createElementFromVNode(vnode){
    // 1.创建一个新的DOM元素
    const dom = document.createElement(vnode.tag)

    // 2.如果虚拟节点有属性，则设置DOM元素的属性
    if(vnode.attrs){
        Object.keys(vnode.attrs).forEach(key =>{
            dom.setAttribute(key,vnode.attrs[key])
        })
    }

    // 3.如果虚拟节点有子节点，则递归地创建子节点DOM
    if(vnode.children){
        vnode.children.forEach(childVode =>{
            // 如果是数字类型，转化为字符串
            if(typeof childVode === 'number'){
                childVode = String(childVode)
            }
            // 对于文本节点，则直接创建文本节点
            if(typeof childVode === 'string'){
                dom.appendChild(document.createTextNode(childVode))
            }
            // 对于普通节点，递归调用该函数
            else{
                dom.appendChild(createElementFromVNode(childVode))
            }
        })
    }

    // 4.返回创建的DOM元素
    return dom
}
// 5. 调用函数，将虚拟DOM节点转换为真实DOM节点，并挂载到某个位置  
const realDom = createElementFromVNode(vnode)
document.body.appendChild(realDom)
```
