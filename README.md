## GSlide, a simple slider

  DOM节点格式如下：
  ```html
  <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>slideLoop</title>
  <link rel="stylesheet" href="g-slide.css">
</head>

<body>
  <div class="g-slide">
    <div class="g-slide-items">
      <div class="g-slide-item active"></div>
      <div class="g-slide-item"></div>
      <div class="g-slide-item"></div>
      <div class="g-slide-item"></div>
      <div class="g-slide-item"></div>
    </div>
  </div>
</body>
<script src="g-slide.js"></script>
<script>
  const slide = document.querySelector('.g-slide');

  new gSlide({
    target: slide,
    effect: 'top',
    loop: true,
    autoplay: true,
    showBtns: true,
    duration: 3000, // 单位毫秒 持续时间
    acting: 200 // 单位毫秒 转换时间
  });

  // 随机颜色方法
  function getRandomColor() {
    return '#' + (Math.random() * 0xffffff << 0).toString(16);
  }
</script>

</html>
```
引入js文件以及css文件，完成初始化代码即可：  
js初始化代码如下： 
```js
new gSlide({
    target: slide, // 目标元素
    effect: 'top', // 效果 包含 left top faded
    loop: true, // 循环滚动
    autoplay: true, // 自动播放
    showBtns: true, // 显示前后切换按钮
    duration: 3000, // 单位毫秒 持续时间
    acting: 200 // 单位毫秒 转换时间
});
```
