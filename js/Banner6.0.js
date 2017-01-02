/* 需求：es6+jq 实现 渐隐渐现轮播图
* 分析 注意this指向问题  在es6中 this指向更复杂
* 步骤
* */
//1 ajax获取数据 解析数据
//2 渲染页面 图片延迟加载 渐现第一张
//3 焦点变化
//4 鼠标悬停
//5 点击焦点 切换图片
//6 点击左右按钮 切换图片

class Banner{
    constructor(opt){
        this.$el = opt.el;
        this.url = opt.url;
        this.duration = opt.duration || 2000;

        this.$oBoxInner = this.$el.children('.boxInner');
        this.$oUl = this.$el.children('ul');
        this.$aBtn = this.$el.children('a');
        this.$oBtnL = this.$el.children('a.left');
        this.$oBtnR = this.$el.children('a.right');

        this.$aimg=null;
        this.$adiv=null;
        this.$ali=null;

        this.data=null;
        this.timer=null;
        this.n=0;
        this.init();
    }

    init(){
        //1 ajax获取数据 解析数据
        this.getData();
//2 渲染页面 图片延迟加载 渐现第一张
        this.paging();
        this.lazyImg();
        // 开启定时器 图片切换
        clearInterval(this.timer)
        this.timer = setInterval( ()=> {
            this.moving();
        },this.duration)
//3 焦点变化
//4 鼠标悬停
        this.mouseMove();
//5 点击焦点 切换图片
        this.clickTip();
//6 点击左右按钮 切换图片
        this.clickBtn();
    }

    getData(){
        let _this = this;
        $.ajax({
            type:'GET',
            url:_this.url,
            dataType:'json',
            async:false,
            success: function (res) {
                _this.data=res;
            }
        })
    }

    paging(){
        let _this = this;
        let strDiv='',strLi='';
        for(let i=0;i<_this.data.length;i++){
        // es6 let 解决了i不准确问题 不需要再使用闭包或者自定义属性
            let cur = _this.data[i];
        //     字符串拼接
            strDiv += `<div><img realImg="${cur.imgSrc}" /></div>`;
            strLi += i==_this.n?'<li class="on"></li>':'<li></li>' ;
        }
        _this.$oBoxInner.html(strDiv).next().html(strLi);

        _this.$aimg = _this.$oBoxInner.find('img');// 获取到所有 img
        _this.$adiv = _this.$oBoxInner.children('div');// 获取到所有 div
        _this.$ali = _this.$oUl.children('li');// 获取到所有 li

    }

    lazyImg(){
        var _this =this;
          for(let i=0;i<_this.$aimg.length;i++){
            let cur = _this.$aimg.eq(i);
            var oimg= new Image();
            oimg.src = cur.attr('realImg');
            oimg.onload = function () {
                cur.attr('src',this.src);
                oimg=null;
                // 渐现第一张图片
                _this.$adiv.first().fadeIn();
            }
        }

    }

    moving(){
        //this.n++;
        // 边界判断
        this.n =  this.n== this.$adiv.length-1?0: this.n+1;
        this.changeImg(); // 图片切换
        this.changeTip(); // 焦点切换
    }

    changeImg(){

        let cur = this.$adiv.eq(this.n);
        cur.stop().fadeIn().siblings().fadeOut();
    }

    changeTip(){
        let cur = this.$ali.eq(this.n);
        cur.addClass('on').siblings().removeClass('on');
    }

    mouseMove(){
        // 这里使用箭头函数 所以这里找到正确的this
        this.$el.mouseover( ()=> {
            clearInterval(this.timer);
            this.$aBtn.show();
        })
        this.$el.mouseout( ()=> {
            this.$aBtn.hide();
            this.timer = setInterval(()=> {
                this.moving();
            },this.duration)
        })
    }

    clickTip(){
        // 改变n
        for(let i=0;i<this.$ali.length;i++){
            let cur = this.$ali.eq(i);
            cur.click( ()=> {
                this.n=i;
                this.changeImg(); // 图片切换
                this.changeTip(); // 焦点切换
            })
        }

    }

    clickBtn(){
        let _this =this;
        this.$aBtn.click(function () {
            // 根据按钮的class判断是左边还是右边  左边-》 n-1  右边 -》 n+1
            if($(this).hasClass('left'))  {
                // 点击左侧按钮 进行边界判断
                _this.n= _this.n==0?_this.$ali.length-1:_this.n-1;
            }else{
                // 点击右侧按钮  进行边界判断
                _this.n= _this.n==_this.$ali.length-1?0:_this.n+1;
            }
            _this.changeImg(); // 图片切换
            _this.changeTip(); // 焦点切换
        })
    }

}
