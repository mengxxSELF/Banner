/* 渐隐渐现轮播图 JQ*/
function Banner(opt){

    this.el = opt.el; // $('#box')
    this.duration = opt.duration; // $('#box')
    this.url = opt.url; // $('#box')

    this.$oBoxInner = this.el.find('.boxInner');
    this.$oUl = this.el.find('ul');
    this.$aDiv=null;
    this.$aImg=null;
    this.aLi= this.el[0].getElementsByTagName('li');

    this.$aBtn= this.el.find('a');
    this.data=null;
    this.timer=null;
    this.n=0;
    this.init();

}

Banner.prototype={
    constructor:'Banner',
    init: function () {
        var _this =this;
        //1 获取数据 解析数据
        _this.getData();
    //    2 渲染页面 图片懒加载  第一张图 显示
        _this.paging();
        _this.lazyImg();
    //    3 开启定时器 图片渐隐渐现
        clearInterval(_this.timer)
        _this.timer = setInterval(function () {
            _this.moving();
        },_this.duration)
    //    4 焦点轮播
    //    5 鼠标悬停
        _this.mouseMove();
    //    6 焦点点击 图片切换
        _this.clickTip();
    //    7 按钮点击 图片切换
        _this.clickBtn();
    },
    getData: function () {
        var _this =this;
        $.ajax({
            url:_this.url,
            type:'GET',
            async:false,
            dataType:'json',
            success: function (val) {
                _this.data=val;
            }
        })
    },
    paging: function () {
        var _this =this ;
        var strDiv='' ;
        var strLi='';
        for(var i=0;i<_this.data.length;i++){
            strDiv+='<div><img realImg='+_this.data[i].imgSrc+'></div>';
            strLi+= i==0?'<li class="on"></li>':'<li></li>';
        }
        _this.$oBoxInner.html(strDiv);
        _this.$oUl.html(strLi);

        _this.$aDiv=_this.$oBoxInner.find('div');
        _this.$aLi=_this.el.find('li');
        _this.$aImg=_this.$oBoxInner.find('img');

        _this.$aBtnLeft=_this.el.find('.left');
        _this.$aBtnRight=_this.el.find('.right');

    },
    lazyImg: function () {
        var _this =this;
        for(var i=0;i<_this.$aImg.length;i++){
            (function (index) {
                var cur = _this.$aImg[index];// 转为js原生
                var oimg = new Image;
                oimg.src= cur.getAttribute('realImg');
                oimg.onload = function () {
                    cur.src=this.src;
                    oimg=null;
                    // 显示第一张图
                    _this.$aDiv.first().fadeIn();
                }
            })(i)
        }
    },
    moving: function () {
        this.n = this.n==this.$aDiv.length-1?0:this.n+1
        this.showImg();
    },
    showImg: function () {
        var _this =this;
        for(var i=0;i<this.$aDiv.length;i++){
            _this.$aDiv.eq(_this.n).stop().fadeIn().siblings().fadeOut();
        }
        this.tipMoving();// 焦点变换
    },
    tipMoving: function () {
        var _this =this;
        for(var i=0;i<this.aLi.length;i++){
            this.aLi[i].className =  i==_this.n?'on':'';
        }
    },
    mouseMove: function () {
        var _this =this;
        this.el.mouseover(function () {
            clearInterval(_this.timer)
            _this.$aBtn.show();
        });
        this.el.mouseout(function () {
            _this.$aBtn.hide();
            _this.timer = setInterval(function () {
                _this.moving();
            },_this.duration)
        })
    },
    clickTip: function () {
        var _this =this;
        _this.$aLi.click(function () {
            var index = $(this).index(); // 获取焦点的索引值
            _this.n= index; // 将n 赋值为index
            _this.showImg(); // 焦点变化
        });
    },
    clickBtn: function () {
        // 左右点击按钮
        var _this =this;
        /*_this.$aBtnRight.click(function () {
            _this.n = _this.n==_this.$aDiv.length-1?0:_this.n+1
            _this.showImg();
        });
        _this.$aBtnLeft.click(function () {
            _this.n = _this.n==0?_this.$aDiv.length-1:_this.n-1
            _this.showImg();
        });*/
        this.$aBtn.click(function () {
            // 根据按钮的class判断是左边还是右边  左边-》 n-1  右边 -》 n+1
            if($(this).hasClass('left'))  {
                // 点击左侧按钮 进行边界判断
                _this.n= _this.n==0?_this.$aDiv.length-1:_this.n-1;
            }else{
                // 点击右侧按钮  进行边界判断
                _this.n= _this.n==_this.$aDiv.length-1?0:_this.n+1;
            }
            _this.showImg();
        })
    }

}
