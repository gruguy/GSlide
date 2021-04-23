
/**
 * slide构造方法
 * option 配置项, 
 * 可传入 target:目标DOM ,
 * effect: 'left | top, 
 * loop: 'true | false' 是否循环播放,顺滑
 * autoplay: 'true | false' 自动播放
 */
function gSlide (option) {
  if (!option.target) {
    throw new Error('target目标对象不能为空！');
    return;
  }
  let index = 0;
  if (option.loop) {
    index = 1;
  }
  let stepTimer = null;
  let moveTime = null;
  let pages = null;
  let clickFlag = true; // 切换标志,防止多次点击出现定时器叠加而抖动
  const slideWrapper = option.target;
  const moveDuration = option.duration || 2000;
  const wrapWidth = slideWrapper.clientWidth;
  const wrapHeight = slideWrapper.clientHeight;
  const wrapConfig = option.effect === 'left' ? wrapWidth : wrapHeight;
  // 设置效果方式
  slideWrapper.classList.add(option.effect || 'faded');
  const slides = slideWrapper.querySelector('.g-slide-items');
  let slideItems = slideWrapper.querySelectorAll('.g-slide-item');
  [...slideItems].forEach((item, index) => {
    item.dataset.index = index;
    // 设置背景随机颜色
    item.style.backgroundColor = getRandomColor();
    // 设置设置内容为index
    item.innerText = index;
  });

  // 插入page
  initPages();

  if (option.loop) {
    // 复制元素
    cloneLoopItems();
  }
  if (option.autoplay) {
    autoplay();
    // 隐藏时清除定时器，打开时执行autoplay
    document.onvisibilitychange = () => document.visibilityState == 'hidden' ? clearInterval(moveTime) : autoplay()
  }

  if (option.showBtns) {
    // 显示切换按钮
    showControls();
  }

  //鼠标移入停播，移出开始播放
  slideWrapper.onmouseover = () => clearInterval(moveTime)
  slideWrapper.onmouseout = () => autoplay()




  /**
   * 显示切换按钮
   */
  function showControls () {
    // 添加上一页下一页
    const controls = document.createElement('div');
    controls.classList.add('g-slide-btns');

    // 上一页
    const prevBtn = document.createElement('div');
    prevBtn.classList.add('g-slide-prev');
    // 下一页
    const nextBtn = document.createElement('div');
    nextBtn.classList.add('g-slide-next');
    controls.appendChild(nextBtn);
    controls.appendChild(prevBtn);
    // 添加分页导航
    slideWrapper.appendChild(controls);
    // 给左右两个按钮绑定事件
    const left = slideWrapper.querySelector('.g-slide-prev');
    const right = slideWrapper.querySelector('.g-slide-next');
    console.log(left);
    left.onclick = function () {
      if (!clickFlag) return
      index--;
      move(slides, option.effect, -index * wrapConfig, moveEnd);
      clickFlag = false
    }
    right.onclick = function () {
      if (!clickFlag) return
      index++;
      console.log(index);
      move(slides, option.effect, -index * wrapConfig, moveEnd);
      clickFlag = false
    }
  }

  /**
   * 自动播放
   */
  function autoplay () {
    moveTime = setInterval(() => {
      index++;
      move(slides, option.effect, -index * wrapConfig, moveEnd);
    }, moveDuration)
  }

  function cloneLoopItems () {
    let first = slides.firstElementChild.cloneNode(true);
    let last = slides.lastElementChild.cloneNode(true);
    // 复制第一个添加到最后一个,复制最后一个添加到第一个
    slides.appendChild(first);
    slides.insertBefore(last, slides.firstElementChild);
    // 设置父元素宽度(或高度),因为增加了子元素,设置默认value值使原始第一个元素排在可视区域
    slides.style.width = slides.children.length * 100 + '%'
    slides.style[option.effect] = -wrapConfig + 'px'
  }

  /**
   * 初始化分页DOM以及选中类名初始化
   */
  function initPages () {
    const pagination = document.createElement('div');
    pagination.classList.add('g-slide-pagination');
    // 添加分页导航
    slideWrapper.appendChild(pagination);

    // 设置默认值，先清除
    slideItems.forEach((item, index) => {
      const page = document.createElement('div');
      page.classList.add('g-slide-pagination-item');
      console.log(index)
      page.dataset.index = index;
      pagination.appendChild(page);
      console.log(slideWrapper.querySelectorAll('.g-slide-pagination-item'))
      slideWrapper.querySelectorAll('.g-slide-pagination-item')[index].classList.remove('active');
      if (index === 0) {
        slideWrapper.querySelectorAll('.g-slide-pagination-item')[index].classList.add('active');
      }
    });
    pages = slideWrapper.querySelector('.g-slide-pagination');
    // 分页按钮添加点击事件
    slideWrapper.querySelector('.g-slide-pagination').addEventListener('click', (e) => {
      if (e.target.classList.contains('g-slide-pagination-item')) {
        if (!clickFlag) return;
        const current = e.target.dataset.index;
        const oldIndex = index;
        index = parseInt(current) + 1;
        const num = Math.abs(index - oldIndex);
        move(slides, option.effect, -index * wrapConfig, moveEnd, num);
        clickFlag = false
      }
    })
  }

  /*
  * @ele 运动元素
  * @attr 运动的属性
  * @value 运动结束后的属性值
  * @moveEnd 运动结束后的回调函数，用于判断边界条件
  * @num 计算切换几个slide,用以来转化速度快慢
  */
  function move (ele, attr, value, moveEnd, num) {
    // 获取元素属性初始值
    let val = parseInt(getComputedStyle(ele)[attr]);
    // 属性值改变过程,需要调用定时器去逐步改变
    let step = 0;
    // 判断是否需要多个slide切换
    if (num) {
      step = parseInt(num * wrapConfig / (option.acting / 10)) || 20
      console.log(num);
      console.log('num');
    } else {
      step = parseInt(wrapConfig / (option.acting / 10)) || 20
    }
    stepTimer = setInterval(() => {
      // 判断变大还是变小,设置步调为10像素
      value > val ? val += step : val -= step;
      ele.style[attr] = val + 'px';
      // 判断边界,(向右或向上, value变大)
      if (value > val) {
        if (val >= value) { // 超出边界
          // 已完成本次运动,清除定时器
          clearInterval(stepTimer);
          // 执行回调
          moveEnd();
        }
      } else { // 向左或向下, value变小
        if (val <= value) {// 超出边界
          // 已完成本次运动,清除定时器
          clearInterval(stepTimer);
          // 执行回调
          moveEnd();
        }
      }
    }, 10);
  }

  /*
  * 步调定时器完成回调方法
  */
  function moveEnd () {
    // 判断边界console.log();
    console.log(index);
    // console.log(slides.children.length);
    const condition = option.loop ? slides.children.length - 1 : slides.children.length
    if (index >= condition) {
      if (option.loop) {
        index = 1;
      } else {
        index = 0;
      }
      slides.style[option.effect] = -index * wrapConfig + 'px'
    } else if (index <= 0) {
      index = slides.children.length - 2;// 增加了2个节点，需要去掉
      console.log(index)
      slides.style[option.effect] = -index * wrapConfig + 'px'
    }
    [...pages.children].forEach(item => {
      item.classList.remove('active');
    })

    clickFlag = true
    // 当前分页按钮选中
    if (option.loop) {
      console.log(index - 1);
      pages.children[index - 1].classList.add('active');
    } else {
      pages.children[index].classList.add('active');
    }
  }
}
