<!--
 * @Author: your name
 * @Date: 2022-04-26 09:57:22
 * @LastEditTime: 2022-04-26 14:25:51
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue-cli2-mobile\src\components\Slider\README.md
-->

# Slider 组件

支持设置滑动条范围，滑动手柄，改变滑动条数值

## 使用

```JavaScript
// 基础用法 停止滑动时触发
<bl-slider  v-model="value" @change="onChange"/>
```

```JavaScript
// 滑动过程触发，delay时长后执行
<bl-slider  v-model="value" :delay="200" @input="onInput"/>
```

```JavaScript
// 指定范围值
<bl-slider  v-model="value" :min="1" :max="100" :step="1" @change="onChange"/>
```

```JavaScript
// 自定义样式
<bl-slider  v-model="value" active-color="#f00" inactive-color="#ff0" @change="onChange"/>
```

```JavaScript
// 禁用
<bl-slider  v-model="value" @change="onChange" disabled/>
```

```JavaScript
// 锁定状态时，不更新推送的value
<bl-slider  v-model="value" @change="onChange" lock/>
```

## 属性 Props

| 参数           | 说明                        | 类型    | 默认值       |
| -------------- | --------------------------- | ------- | ------------ |
| value          | 当前进度百分比              | number  | 0            |
| max            | 最大值                      | number  | 100          |
| min            | 最小值                      | number  | 0            |
| step           | 步长                        | number  | 1            |
| bar-height     | 进度条高度，默认单位为 px   | number  | 2px          |
| button-size    | 滑块按钮大小，默认单位为 px | number  | 24px         |
| active-color   | 进度条激活态颜色            | string  | @theme-color |
| inactive-color | 进度条非激活态颜色          | string  | #e5e5e5      |
| disabled       | 是否禁用滑块                | boolean | false        |
| lock           | 滑动过程,是否锁定滑块值更新 | boolean | false        |
| delay          | 执行延迟时长                | number  | 0(ms)        |

## 事件 Events

| 名称       | 说明                     | 回调参数        |
| ---------- | ------------------------ | --------------- |
| input      | 进度变化时实时触发       | value: 当前进度 |
| change     | 进度变化且结束拖动后触发 | value: 当前进度 |
| drag-start | 开始拖动时触发           |                 |
| drag-end   | 结束拖动时触发           |                 |

## 样式变量

| 名称                              | 默认值                       |
| --------------------------------- | ---------------------------- |
| @slider-active-background-color   | @theme-color                 |
| @slider-inactive-background-color | @gray-3                      |
| @slider-disabled-opacity          | @disabled-opacity            |
| @slider-bar-height                | 2px                          |
| @slider-button-width              | 24px                         |
| @slider-button-height             | 24px                         |
| @slider-button-border-radius      | 50%                          |
| @slider-button-background-color   | @white                       |
| @slider-button-box-shadow         | 0 1px 2px rgba(0, 0, 0, 0.5) |
