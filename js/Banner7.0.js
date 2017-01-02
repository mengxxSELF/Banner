/* 需求 配合jq  构造函数 进行图片切换
步骤 1 ajax 获取数据 解析数据
2 渲染页面  注意进行最后一张的添加
3 开启定时器 图片切换
4 焦点变化
5 鼠标悬停
6 点击焦点 切换图片
7 点击左右 切换图片
* */
function Banner(opt){
    if(!opt.el) return;
    this.$oBox = opt.el;
    this.url = opt.url;
    this.duration=opt.duration||2500;

    this.$oInnerBox = this.$oBox.children('.boxInner');
    this.$oUl= this.$oBox.children('ul');
    this.$aBtn= this.$oBox.children('a');
    this.$ali= null;
    this.$aimg= null;
    this.$adiv= null;

    this.data=null;
    this.n=0;
    this.timer=null;
    this.init();
}
Banner.prototype={
    constructor:'Banner',
    init: function () {
        var _this =this;
        //1 ajax 获取数据 解析数据
        _this.getData();
        //2 渲染页面  注意进行最后一张的添加 改变盒子宽度
        _this.pageShow();
        _this.lazyImg();
        //    3 开启定时器 图片切换
        clearInterval(_this.timer)
        _this.timer=setInterval(function () {
            _this.moving();
        },_this.duration)
        //4 焦点变化
        //5 鼠标悬停
        _this.mouseMove();
        //6 点击焦点 切换图片
        _this.clickTip();
        //    7 点击左右 切换图片
        _this.clickBtn();
    },
    getData: function () {
        var _this = this;
        $.ajax({
            type: "GET",
            async:false, // 注意这里对同步异步进行处理
            url: _this.url,
            dataType:'json',
            success: function(msg){
                _this.data=msg;
            }
        });
    },
    pageShow: function () {
        var _this = this;
        var strDiv ='', strLi='';
        for(var i=0;i<_this.data.length;i++){
            strDiv+='<div><img realImg='+_this.data[i].imgSrc+'></div>';
            strLi+= i==0?'<li class="on"></li>':'<li></li>';
        }
        // 追加第一张图片
        strDiv+='<div><img realImg='+_this.data[0].imgSrc+'></div>';
        this.$oInnerBox.html(strDiv);
        this.$oUl.html(strLi);

        this.$adiv=this.$oInnerBox.children('div');
        this.$aimg=this.$oInnerBox.find('img');
        this.$ali= this.$oBox.find('li');
        // 改变宽度
        var nowWidth = this.$adiv.first().width()*this.$adiv.length+'px';
        this.$oInnerBox.css('width',nowWidth)
    },
    lazyImg: function () {
        var _this =this;
        for(var i=0;i<this.$aimg.length;i++){
            (function (index) {
                var cur = _this.$aimg[i];
                var oimg = new Image;
                oimg.src= cur.getAttribute('realImg')
                oimg.onload= function () {
                    cur.src= this.src;
                    oimg=null;
                }
            })(i)
        }
    },
    moving: function () {
        if(this.n>= this.$adiv.length-1){
            this.n= 0;
            this.$oInnerBox.css('left',-this.n*1000+'px');
        }
        this.n++;
        this.changeImg();
    },
    changeImg: function () {
        this.$oInnerBox.animate({
            left: -this.n*1000+'px'
        })
        this.tipMoving();
    },
    tipMoving: function () {
        var index = this.n%(this.$adiv.length-1);
        this.$ali.eq(index).addClass('on').siblings().removeClass('on');
    },
    mouseMove(){
        var _this =this;
        this.$oBox.mouseover(function () {
            _this.$aBtn.show();
            clearInterval(_this.timer)
        }).mouseout(function () {
            _this.$aBtn.hide();
            _this.timer=setInterval(function () {
                _this.moving();
            },_this.duration)
        })
    },
    clickTip(){
        var _this =this;
        this.$ali.click(function () {
            _this.n= $(this).index();
            _this.changeImg();
        })
    },
    clickBtn(){
        // 点击 left n-- ; right n++;
        var _this =this;
        this.$aBtn.click(function () {
            if($(this).hasClass('left')){
                if( _this.n<=0){
                    _this.n= _this.$adiv.length-1;
                    _this.$oInnerBox.css('left',-_this.n*1000+'px');
                }
                _this.n--;
                _this.changeImg();
            }else{
                _this.moving();
            }
        })
    }
}