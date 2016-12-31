/**
 * Created by 39753 on 2016/12/25.
 */
/*
(function(){
    /!*var utils={

    }
    window.utils=utils;*!/
    /!*window.utils={

     }*!/
    utils={

    }
})();*/
var utils=(function(){
    var flg='getComputedStyle' in window;
    function makeArray(args){
        if(flg){
            return Array.prototype.slice.call(args);
        }else{
            var ary=[];
            for(var i=0; i<args.length; i++){
                ary.push(args[i]);
            }
            return ary;
        }
    }
    function jsonParse(jsonStr){
        return 'JSON' in window?JSON.parse(jsonStr):eval('('+jsonStr+')')
    }
    function rnd(n,m){
        n=Number(n);
        m=Number(m);
        if(isNaN(n) || isNaN(m)){
            return Math.random();//返回0-1之间随机小数代表传参错误；
        }
        if(n>m){
            var tmp=m;
            m=n;
            n=tmp;
        }
        return Math.round(Math.random()*(m-n)+n);
    }
    function win(attr,value){
        if(value===undefined){
            return document.documentElement[attr]||document.body[attr];
        }
        document.documentElement[attr]=document.body[attr]=value;
    }
    function offset(curEle){
        var par=curEle.offsetParent;
        var l=curEle.offsetLeft;
        var t=curEle.offsetTop;
        while(par){
            if(window.navigator.userAgent.indexOf('MSIE 8')===-1){
                l+=par.clientLeft;
                t+=par.clientTop;
            }
            l+=par.offsetLeft;
            t+=par.offsetTop;
            par=par.offsetParent;
        }
        return {left:l,top:t};
    }
    function getByClass(strClass,context){
        context=context||document;
        if(flg){
            return this.makeArray(context.getElementsByClassName(strClass))
        }else{//兼容IE6-8
            //1.字符串转数组
            var aryClass=strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
            //2.获取当前容器下的所有元素
            var nodeList=context.getElementsByTagName('*');
            var ary=[];
            //3.逐个校验每个元素的class名
            for(var i=0; i<nodeList.length; i++){
                var cur=nodeList[i];
                var bOk=true;
                for(var j=0; j<aryClass.length; j++){
                    var reg=new RegExp('(^| +)'+aryClass[j]+'( +|$)','g');
                    if(!reg.test(cur.className)){
                        bOk=false;
                        break;
                    }
                }
                if(bOk){
                    ary.push(cur);
                }
            }
            return ary;
        }
    }
    function hasClass(curEle,cName){
        var reg=new RegExp('(^| +)'+cName+'( +|$)','g');
        return reg.test(curEle.className);
    }
    function addClass(curEle,strClass){
        var aryClass=strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
        //验证元素身上，如果没有某个class名，进行添加，添加时一定要注意空格；
        for(var i=0; i<aryClass.length; i++){
            if(!this.hasClass(curEle,aryClass[i])){
                curEle.className+=' '+aryClass[i];
            }
        }
    }
    function removeClass(curEle,strClass){
        var aryClass=strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
        for(var i=0; i<aryClass.length; i++){
            var reg=new RegExp('(^| +)'+aryClass[i]+'( +|$)','g');
            if(reg.test(curEle.className)){
                curEle.className=curEle.className.replace(reg,' ').replace(/(^ +)|( +$)/g,'').replace(/\s+/g,' ');
            }
        }
    }
    function getCss(curEle,attr){
        var val,reg;
        if(flg){
            val=getComputedStyle(curEle,false)[attr];
        }else{
            if(attr==='opacity'){
                val=curEle.currentStyle.filter;
                reg=/^alpha\(opacity[:=](\d+)\)$/g;
                return reg.test(val)?RegExp.$1/100:1;

            }else{
                val=curEle.currentStyle[attr];
            }
        }
        //处理单位；
        reg=/^[+-]?(\d+(\.\d+)?)(px|pt|rem|em)?$/gi;
        return reg.test(val)?parseFloat(val):val;
    }
    function setCss(curEle,attr,value){
        //处理浮动
        if(attr==='float'){
            //IE
            curEle.style.styleFloat=value;
            //Firefox，chrome，safari
            curEle.style.cssFloat=value;
            return;
        }
        //处理透明度
        if(attr==='opacity'){
            curEle.style.opacity=value;
            curEle.style.filter='alpha(opacity='+value*100+')';
            return;
        }
        //处理单位：width,height,left,top,right,bottom,margin,marginLeft,padding,paddingLeft
        var reg=/^(width|height|top|right|bottom|left|((margin|padding)(top|right|bottom|left)?))$/i;
        //toString是转成字符串；距离实例最近的原型上的toString()
        if(reg.test(attr)){
            if(!/(%|auto)/.test(value)){
                value=parseInt(value)+'px';
            }
        }
        curEle.style[attr]=value;
    }
    function setGroupCss(curEle,opt){
        //toString是Object.prototype上的，用来数据类型检测的；功能，可以打印出this所属类的详细信息；
        if({}.toString()!=='[object Object]') {
            console.log('opt不是对象');
            return;
        };
        for(var attr in opt){
            this.setCss(curEle,attr,opt[attr])
        }
    }
    function css(curEle){
        var argTwo=arguments[1];
        //如果第二个参数是个字符串的话，获取 或  设置一个
        if(typeof argTwo==='string'){
            var argThree=arguments[2];
            //获取
            if(typeof argThree==='undefined'){
                return this.getCss(curEle,argTwo)
            }else{
                //设置一个
                this.setCss(curEle,argTwo,argThree);
            }

        }
        //如果第二个参数是个对象的话，设置一组
        if(argTwo.toString()==='[object Object]'){
            this.setGroupCss(curEle,argTwo)
        }
    }
    function getChildren(curEle,tagName){
        //获取所有的子节点
        var nodeList=curEle.childNodes;
        var ary=[];
        //逐个验证每个子节点是否为元素节点
        for(var i=0; i<nodeList.length; i++){
            var cur=nodeList[i];
            if(cur && cur.nodeType===1){
                //第二个参数不存在；没有过滤的功能
                if(tagName===undefined){
                    ary.push(cur);
                }else{
                    //说明第二个参数存在，有过滤的功能；
                    if(cur.tagName.toLowerCase()===tagName.toLowerCase()){
                        ary.push(cur);
                    }
                }
            }
        }
        return ary;
    }
    function prev(curEle){
        if(flg){
            return curEle.previousElementSibling;
        }
        var pre=curEle.previousSibling;
        while(pre && pre.nodeType!==1){
            pre=pre.previousSibling;
        }
        return pre;
    }
    function next(curEle){
        if(flg){
            return curEle.nextElementSibling;
        }
        var nex=curEle.nextSibling;
        while(nex && nex.nodeType!==1){
            nex=nex.nextSibling;
        }
        return nex;
    }
    function sibling(curEle){
        var ary=[];
        var prev=this.prev(curEle);
        var next=this.next(curEle);
        if(prev) ary.push(prev);
        if(next) ary.push(next);
        return ary;
    }
    function prevAll(curEle){
        var ary=[];
        var pre=this.prev(curEle);
        while(pre){
            ary.push(pre);
            pre=this.prev(pre);
        }
        return ary;
    }
    function nextAll(curEle){
        var ary=[];
        var next=this.next(curEle);
        while(next){
            ary.push(next);
            next=this.next(next);
        }
        return ary;
    }
    function siblings(curEle){
        var prevAll=this.prevAll(curEle);
        var nextAll=this.nextAll(curEle);
        return prevAll.concat(nextAll);
    }
    function index(curEle){
        return this.prevAll(curEle).length;
    }
    function firstChild(curEle){
        var aChild=this.getChildren(curEle);
        return aChild[0];
    }
    function lastChild(curEle){
        var aChild=this.getChildren(curEle);
        return aChild[aChild.length-1];
    }
    function appendChild(curEle,parent){
        parent.appendChild(curEle);
    }
    function prependChild(curEle,parent){
        var first=this.firstChild(parent);
        //如果first为真，说明有第一个子元素
        if(first){
            parent.insertBefore(curEle,first);
        }else{
            //说明父容器下没有元素
            parent.appendChild(curEle);
        }
    }
    function insertBefore(curEle,oldEle){
        oldEle.parentNode.insertBefore(curEle,oldEle);
    }
    function insertAfter(curEle,oldEle){
        //原理：把当前元素插入到旧元素的弟弟元素的前面
        var next=this.next(oldEle);
        if(next){
            //当旧元素有弟弟元素的时候，把新元素插入到弟弟元素的前面；
            oldEle.parentNode.insertBefore(curEle,next);
        }else{
            //当旧元素没有弟弟元素的时候，把新元素插入到容器的末尾；
            oldEle.parentNode.appendChild(curEle)
        }
    }
    return {
        //makeArray:类数组转数组
        makeArray:makeArray,
        //jsonParse:把JSON格式字符串转成JSON格式的数据（对象格式）
        jsonParse:jsonParse,
        //rnd:获取一定范围的随机整数
        rnd:rnd,
        //win：浏览器盒子模型兼容处理：获取，设置
        win:win,
        //offset:获取元素的偏移量；
        offset:offset,
        //getByClass:限定范围的通过class名获取元素
        getByClass:getByClass,
        //hasClass:判断元素身上是否有某个class名
        hasClass:hasClass,
        //addClass:给元素身上添加某个class名
        addClass:addClass,
        //removeClass:元素身上如果有某个class名，替换为空格；
        removeClass:removeClass,
        //getCss:获取元素的某个样式；
        getCss:getCss,
        //setCss:给元素的某个属性名添加一个属性值
        setCss:setCss,
        //setGroupCss:给元素设置一组样式
        setGroupCss:setGroupCss,
        //css:集获取，设置一个，设置一组为一体；
        css:css,
        //getChildren:获取当前元素下所有的子元素，并且可以有过滤的功能
        getChildren:getChildren,
        //prev: 获取当前元素的上一个哥哥元素
        prev:prev,
        //next:获取当前元素的下一个弟弟元素
        next:next,
        //siblings:获取当前元素的相邻元素
        sibling:sibling,
        //prevAll:获取当前元素所有的哥哥元素
        prevAll:prevAll,
        //nextAll:获取当前元素所有的弟弟元素
        nextAll:nextAll,
        //siblings:获取当前元素所有的兄弟元素
        siblings:siblings,
        //index:获取当前元素的索引:有几个哥哥，索引就是几；
        index:index,
        //firstChild:求当前容器下，第一个子元素；
        firstChild:firstChild,
        //lastChild:求当前容器下，最后一个子元素
        lastChild:lastChild,
        //appendChild:把当前元素插入到父容器的末尾
        appendChild:appendChild,
        //prependChild:插入到容器的最开始；
        prependChild:prependChild,
        //insertBefore:把当前元素插入到指定元素的前面；
        insertBefore:insertBefore,
        //insertAfter:把当前元素插入到指定元素的后面
        insertAfter:insertAfter
    }
})();
