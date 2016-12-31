/* 需求： 渐隐渐现轮播图
* 分析 1 变量转为 私有属性 函数为共有方法
*      2 时刻注意this 指向问题  在定时器 事件  匿名函数 回调函数  中this 会出问题
*      3 init 表示函数的执行顺序
*      4 设置一个 defaultOpt  记录默认值
* 步骤
* 1 ajax 获取数据 解析数据
* 2 渲染页面 【图片延迟加载   渐现第一张图片】
* 3 开启定时器 图片切换
* 4 焦点切换
* 5 鼠标悬停
* 6 焦点点击 进行图片切换
* 7 左右点击 图片切换
* */
function Banner(opt){
    if(!opt.el) return;
    this.oBox = opt.el;
    this.duration=opt.duration||2500;
    this.oInnerBox = document.getElementsByClassName('boxInner')[0];
    this.oBtnL = document.getElementsByTagName('a')[0];
    this.oBtnR = document.getElementsByTagName('a')[1];
    this.oUl = document.getElementsByTagName('ul')[0];
    this.ali = document.getElementsByTagName('li');
    this.adiv = this.oInnerBox.getElementsByTagName('div');
    this.aimg = document.getElementsByTagName('img');
    this.n=0; // 记录需要显示的图片索引
    this.timer; // 定时器
    this.data;
    this.init();
}
Banner.prototype={
    constructor:'Banner',
    init: function () {
        var _this =this;  // 为了防止this 问题 这里直接设置一个 _this
/* 1 ajax 获取数据 解析数据 */
        _this.getData();
        /* 2 渲染页面 【图片延迟加载   渐现第一张图片】*/
        _this.pageShow();
        _this.lazyImg();
        _this.showFirstImg();
 /* 3 开启定时器 图片切换 */
        clearInterval(_this.timer)
        _this.timer=setInterval(function () {
            _this.moving();
            _this.tipMoving(); /* 4 焦点切换*/
        },_this.duration)
 /* 5 鼠标悬停 */
        _this.mouseChange();
 /* 6 焦点点击 进行图片切换 */
         _this.clickTip();
 /* 7 左右点击 图片切换 */
        _this.clickBtn();
    },
    getData: function () {
        var _this =this;
        var xml = new XMLHttpRequest();
        xml.open('get','json/data.txt',false);
        xml.onreadystatechange = function () {
            if(xml.readyState==4&&(/^2\d{2}$/).test(xml.status)){
                _this.data = utils.jsonParse(xml.responseText);
            }
        }
        xml.send();
    },
    pageShow: function () {
        var _this =this;
        var strDiv ='', strLi='';
        for(var i=0;i<_this.data.length;i++){
            strDiv+='<div><img realImg='+_this.data[i].imgSrc+'></div>';
            strLi+= i==0?'<li class="on"></li>':'<li></li>';
        }
        _this.oInnerBox.innerHTML+=strDiv;
        _this.oUl.innerHTML+=strLi;
    },
    lazyImg: function () {
        var _this =this;
        for(var i=0; i<_this.aimg.length; i++) {
            (function (index) {
                var cur = _this.aimg[index]
                var oimg= new Image();
                oimg.src = cur.getAttribute('realImg');
                oimg.onload = function () {
                    cur.src=this.src;
                    oimg=null;
                }
            })(i)
        }
    },
    showFirstImg: function () {
        utils.css(this.adiv[0],{zIndex:1});
        animate({
            id:this.adiv[0],
            target:{
                opacity:1
            }
        })
    },
    moving: function () {
        // 图片切换 当前层级 1 其余0  当前opacity 1 然后其余0
        var _this =this;
       // _this.n++;
        // 边界判断
        _this.n = (_this.n==_this.adiv.length-1)?0:_this.n+1;
        _this.animating();
    },
    animating: function () {
        var _this =this;
        for(var i=0;i<_this.adiv.length;i++){
            var cur = _this.adiv[i]
            if(i==_this.n){
                utils.css(cur,{zIndex:1});
                animate({
                    id:cur,
                    target:{
                        opacity:1
                    },
                    cb: function () {
                        for(var j=0;j<_this.adiv.length;j++){
                            if(j!=_this.n){
                                utils.css(_this.adiv[j],{opacity:0})
                            }
                        }
                    }

                })
            }else{
                utils.css(cur,{zIndex:0})
            }
        }
    },
    tipMoving: function () {
        for(var i=0;i<this.ali.length;i++){
            this.ali[i].className= this.n==i?'on':null;
        }
    },
    mouseChange: function () {
        var _this =this;
        this.oBox.onmouseover = function () {
            clearInterval(_this.timer)
            _this.oBtnL.style.display = _this.oBtnR.style.display='block';
        }
        this.oBox.onmouseout = function () {
            _this.timer=setInterval(function () {
                _this.moving(); // 图片切换
                _this.tipMoving(); /* 4 焦点切换*/
            },_this.duration)
            _this.oBtnL.style.display = _this.oBtnR.style.display='none';
        }
    },
    clickTip: function () {
        var _this =this;
        for(var i=0;i<this.ali.length;i++){
            (function (index) {
                var cur= _this.ali[index];
                cur.onclick = function () {
                    // 相当于改变n
                    _this.n= index;
                    _this.animating();
                    _this.tipMoving(); /* 4 焦点切换*/
                }
            })(i)
        }
    },
    clickBtn: function () {
        var _this =this;
        _this.oBtnR.onclick = function () {
            _this.moving();
            _this.tipMoving();
        };
        _this.oBtnL.onclick = function () {
            // 左边按钮点击
            _this.n= _this.n==0?_this.adiv.length-1:_this.n-1;
            _this.animating();
            _this.tipMoving();
        }
    }


}