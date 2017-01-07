/* 渐隐渐现 banner  es6 jQuery */
// ajax 获取数据 解析数据
// 根据数据进行页面渲染 图片延迟加载 渐现第一张
// 开启定时器 切换图片
// 焦点切换
// 鼠标悬停
// 点击焦点 图片切换
// 点击左右按钮 切换图片

class Banner{
    constructor(opt){
        if(!opt.el) return;
        this.$el = opt.el;
        this.url=opt.url;
        this.duration=opt.duration||2000;


        this.$inner = this.$el.children('.inner');
        this.$ul = this.$el.children('ul');
        this.$aBtns = this.$el.find('a');

        this.$aDiv=null;
        this.$aImg=null;
        this.$aLi=null;


        this.data=null;
        this.timer=null;
        this.n=0;
        this.init()
    }
    init(){
        // ajax 获取数据 解析数据
        this.getData();
// 根据数据进行页面渲染 图片延迟加载 渐现第一张
        this.pageShow()
// 开启定时器 切换图片
        clearInterval(this.timer)
        this.timer = setInterval(()=>{
            this.moving()
        },this.duration)
// 焦点切换
// 鼠标悬停
        this.mouseStop();
// 点击焦点 图片切换
        this.clickTip()
// 点击左右按钮 切换图片
        this.clickBtn()

    }

    getData(){
        $.ajax({
            type:'GET',
            async:false,
            dataType:'json',
            url:this.url,
            success:(res)=>{
                this.data=res;
            }
        })
    }
    pageShow(){
        let strDiv='';
        let strLi='';
        for(let i=0;i<this.data.length;i++){
            let cur = this.data[i];
            strDiv+=`<div><img realImg="${cur.imgSrc}" /></div>` ;
            strLi+= i==0?'<li class="on"></li>':'<li></li>';
        }
        this.$inner.html(strDiv);
        this.$ul.html(strLi);

        this.$aDiv = this.$inner.children('div');
        this.$aImg = this.$inner.find('img');
        this.$aLi = this.$el.find('li');

        this.lazyImg();
    }
    lazyImg(){
        for(let i=0;i<this.$aImg.length;i++) {
            let cur = this.$aImg.eq(i);
            let oimg = new Image;
            oimg.src= cur.attr('realImg');
            oimg.onload = function () {
                cur.attr('src',this.src);
                oimg=null;
            }
        }
        // 渐现第一张
        this.$aDiv.eq(0).fadeIn();
    }

    moving(){
        this.n = this.n==this.$aDiv.length-1?0:this.n+1;
        this.changeImg();
    }
    changeImg(){
        this.$aDiv.eq(this.n).fadeIn().siblings().fadeOut();
        this.$aLi.eq(this.n).addClass('on').siblings().removeClass('on');
    }
    mouseStop(){
        this.$el.mouseover( ()=> {
            clearInterval(this.timer);
            this.$aBtns.show();
        }).mouseout( ()=> {
            this.$aBtns.hide();
            this.timer = setInterval(()=>{
                this.moving()
            },this.duration)
        })
    }

    clickTip(){
        let _this =this;
        this.$aLi.click(function () {
            _this.n= $(this).index();
            _this.changeImg();
        })
    }
    clickBtn(){
        this.$aBtns.eq(0).click( ()=> { // left
            this.n = this.n==0?this.$aDiv.length-1:this.n-1;
            this.changeImg();
        }).next().click( ()=> { // right
            this.moving();
        })
    }

}








