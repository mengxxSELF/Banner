/*  构造函数  */
//  变量 -》  私有属性  函数-》 公有方法
function Banner(opt){
    this.el = opt.el;
    this.duration = opt.duration;
    this.effect = opt.effect||0;
    this.oBoxInner= this.el.getElementsByTagName('div')[0];
    this.aDiv= this.oBoxInner.getElementsByTagName('div');
    this.oUl= this.el.getElementsByTagName('ul')[0];
    this.aLi= this.oUl.getElementsByTagName('li');
    this.oBtnLeft= this.el.getElementsByTagName('a')[0];
    this.oBtnRight= this.el.getElementsByTagName('a')[1];
    this.n=0;//全局的n决定了让第几张图片显示
    this.timer=null;
    this.init(); // 执行init
}

Banner.prototype={
    constructor:'Banner',
    init: function () {
        var _this =this;
        // 执行顺序
    //    1 追加图片改变宽度
        this.oBoxInner.innerHTML+='<div><img src="img/1.jpg" alt=""></div>';
        this.oBoxInner.style.width= this.aDiv[0].offsetWidth* this.aDiv.length+'px';

        //    2 开启定时器 图片轮播
        clearInterval(this.timer);
        this.timer = setInterval(function () {
            _this.moving();
        },this.duration)

    //    3 焦点轮播 bannerTip
    //    4 鼠标悬停
        this.mouseChange();
    //    5 点击焦点 图片切换
        this.clickTip();
    //    6 点击左右 图片切换
        this.clickBtn();
    },
    moving: function () {
        // 切换图片
        if(this.n>=this.aDiv.length-1){ //  边界判断
            this.n=0;
            utils.css(this.oBoxInner,'left',-this.n*1000)
        }
        this.n++;
        animate({
            id:this.oBoxInner,
            target:{
                left:-this.n*1000
            },
            effect:this.effect
        });
        this.bannerTip(); // 焦点
    },
    bannerTip: function () {
        for(var i=0;i<this.aLi.length;i++){
            this.aLi[i].className= this.n%4==i?'on':''
        }
    },
    mouseChange: function () {
    //     鼠标悬停
        var _this =this;
        this.el.onmouseover = function () {
            clearInterval(_this.timer);
            _this.oBtnLeft.style.display  =  _this.oBtnRight.style.display = 'block'

        }
        this.el.onmouseout = function () {
            _this.oBtnLeft.style.display  =  _this.oBtnRight.style.display = 'none'
            _this.timer = setInterval(function () {
                _this.moving();
            },_this.duration)
        }
    },
    clickTip: function () {
        // 焦点点击 i  n
        var _this =this;
        for(var i=0;i<this.aLi.length;i++){
            var cur = this.aLi[i]
            cur.index = i;
            cur.onclick = function () {
                _this.n=this.index;
                animate({
                    id:_this.oBoxInner,
                    target:{
                        left:-_this.n*1000
                    }
                });
                _this.bannerTip(); // 焦点
            }
        }
    },
    clickBtn: function () {
        // 按钮点击
        var _this =this;
        this.oBtnRight.onclick = function () {
            _this.moving();
        };
        this.oBtnLeft.onclick = function () {
            if(_this.n<=0){ // 边界
                _this.n=_this.aDiv.length-1;
                utils.css(_this.oBoxInner,'left',-_this.n*1000);
            }
            _this.n--;
            animate({
                id:_this.oBoxInner,
                target:{
                    left:-_this.n*1000
                }
            });
            _this.bannerTip(); // 焦点
        }
    }
}