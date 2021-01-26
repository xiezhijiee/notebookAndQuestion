# components 组件

### 组件name的作用

**1.当项目使用keep-alive时，可搭配组件name进行缓存过滤**

**2.DOM做递归组件时**

比如说detail.vue组件里有个list.vue子组件，递归迭代时需要调用自身name

**3.当你用vue-tools时**
vue-devtools调试工具里显示的组见名称是由vue中组件name决定的