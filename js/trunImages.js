HTMLDivElement.prototype.createTurnImg = function(imgArray,hasBtn,hasIndex){
    imgArray = imgArray || ["./img/pic1.jpg","./img/pic2.jpg","./img/pic3.jpg","./img/pic4.jpg","./img/pic1.jpg"];
    if(imgArray.length == 0 ){
        imgArray = ["./img/pic1.jpg","./img/pic2.jpg","./img/pic3.jpg","./img/pic4.jpg","./img/pic1.jpg"];
    }
    hasBtn = hasBtn || "true";
    hasIndex = hasIndex || "true";
    var _this = this;
    /**
     * 配置初始化内容
     * oUlHeight:轮播外层ul的高度
     * oUlWidth:轮播外层ul的宽度
     * urlArray：图片地址集合
     * isBtn:是否有左右键
     * isIndex：是否显示小圆点
     * timer：定时器
     * lock:锁，用来保证每个定时器相互不影响
     * index:小圆点的索引
     * num:一共多少种图片
     *  */
    
    var config = {
        oUlWidth: _this.offsetWidth * imgArray.length,
        oUlHeight: _this.offsetHeight,
        urlArray: imgArray,
        isBtn: hasBtn,
        isIndex: hasIndex,
        moveWidth: _this.offsetWidth,
        timer: null,
        index: 0,
        lock: true,
        num: imgArray.length - 1,
        createElem: function(){//渲染轮播页面元素
            var oWraper = document.createElement("div");
            oWraper.style.width = (_this.offsetWidth || 400) +"px";
            oWraper.style.height = (_this.offsetHeight || 300) +"px";
            oWraper.className = "wrapper";

            var oSlider = document.createElement("ul");
            oSlider.style.width = (this.oUlWidth || 2000) +"px";
            oSlider.style.height = (this.oUlHeight || 300) +"px";
            oSlider.className = "sliderContainer";
            for(var i = 0 ; i < this.urlArray.length; i++){
                var oli = document.createElement("li");
                var oImg = new Image();
                oImg.src = this.urlArray[i];
                oli.style.width = (_this.offsetWidth || 400) + "px";
                oli.style.height = (_this.offsetHeight || 300) + "px";
                oli.appendChild(oImg);
                oSlider.appendChild(oli);
            }

            var leftBtn = document.createElement("div");
            var rightBtn = document.createElement("div");
            leftBtn.innerHTML = "<";
            rightBtn.innerHTML = ">"
            leftBtn.className = "btn leftBtn";
            rightBtn.className = "btn rightBtn";

            oWraper.appendChild(oSlider);
            if(this.isBtn == "true"){
                oWraper.appendChild(leftBtn);
                oWraper.appendChild(rightBtn);
            }
            var oSliderIndex = document.createElement("ul");
            oSliderIndex.className = "sliderIndex";
            for(var i = 0 ; i < this.urlArray.length - 1; i++){
                var oIndexLi = document.createElement("li");
                if(i == 0){
                    oIndexLi.className = "active";
                }
                oSliderIndex.appendChild(oIndexLi);
            }
            if(this.isIndex == "true"){
                oWraper.appendChild(oSliderIndex);
            }
            
            _this.appendChild(oWraper);
            
        },
        init: function(){
            var _this = this;
            this.createElem();
            var leftBtn = document.getElementsByClassName("leftBtn")[0];
            var rightBtn = document.getElementsByClassName("rightBtn")[0];
            var sliderContainer = document.getElementsByClassName("sliderContainer")[0];
            var sliderIndex = document.getElementsByClassName("sliderIndex")[0];
            var slideLen = sliderIndex.children.length;
            if(this.isBtn == "true"){
                leftBtn.onclick = function(){
                    _this.autoPlay("leftToRight");
                }
                rightBtn.onclick = function(){
                    _this.autoPlay("rightToLeft");
                }

            }

            if(this.isIndex == "true"){
                for(var i = 0; i < slideLen; i++){
                    (function (j) {
                        sliderIndex.children[j].onclick = function(){
                            clearTimeout(_this.timer);
                            _this.index = j;
                            _this.changeIndex(_this.index);
                            config.startMove(sliderContainer,{"left":-_this.index * _this.moveWidth},function(){
                                _this.lock = true;
                                _this.timer = setTimeout(function(){_this.autoPlay()},1500);
                                
                            });
                        }
                    }(i))   
                }
            }

            this.timer = setTimeout(function(){
                config.autoPlay();
            },1500);
        },
        autoPlay: function(deirction){
            clearTimeout(this.timer);
            var sliderContainer = document.getElementsByClassName("sliderContainer")[0];
            var _this = this;
            
            if(_this.lock){
                _this.lock = false;
                if (deirction == undefined || deirction == "rightToLeft") {
                    _this.index ++;
                    
                    config.startMove(sliderContainer, { "left": sliderContainer.offsetLeft - _this.moveWidth }, function () {
                        if (sliderContainer.offsetLeft == -_this.num * _this.moveWidth) {
                            sliderContainer.style.left = "0px";
                            _this.index = 0;
                        }
                        _this.changeIndex(_this.index);
                        
                        _this.timer = setTimeout(function(){_this.autoPlay()}, 1500);
                        config.lock = true;
                    });    

                } else if (deirction == "leftToRight") {
                    if (sliderContainer.offsetLeft == 0) {
                        sliderContainer.style.left = -_this.moveWidth * _this.num + "px";
                        _this.index = _this.num;
                    }
                    _this.index --;
                    _this.changeIndex(_this.index);
                    config.startMove(sliderContainer, { "left": sliderContainer.offsetLeft + _this.moveWidth }, function () {
                        _this.timer = setTimeout(function(){_this.autoPlay()}, 1500);
                        _this.lock = true;
                        
                    });   
                    
                }
            }
        },
        startMove:function(dom,obj,callback){
            clearInterval(dom.timer);
            var speed = 0;
            var current = 0;
            var _this = this;
            dom.timer = setInterval(function () {
                var moveLock = true;
                for (var attr in obj) {
                    if (attr == "opacity") {
                        current = parseFloat(_this.getStyle(dom, attr)) * 100;
                    } else {
                        current = parseInt(_this.getStyle(dom, attr));
                    }
                    speed = (obj[attr] - current) / 7;
                    speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                    if (attr == "opacity") {
                        dom.style.opacity = (speed + current) / 100;
                    } else {
                        dom.style[attr] = current + speed + "px"
                    }

                    if (current != obj[attr]) {
                        moveLock = false;
                    }
                }

                if (moveLock) {
                    clearInterval(dom.timer);
                    typeof callback == "function" && callback();
                }
            }, 30)
        },
        getStyle:function(dom, prop){
            if (window.getComputedStyle) {
                return window.getComputedStyle(dom, null)[prop];
            } else {
                return dom.currentStyle[prop];
            }
        },
        changeIndex:function(iCircle){
            var sliderIndex = document.getElementsByClassName("sliderIndex")[0];
            var slideLen = sliderIndex.children.length;
            for (var i = 0; i < slideLen; i++) {
                sliderIndex.children[i].className = "";
            }
            sliderIndex.children[iCircle].className = "active";
        }
    }
    config.init();
}