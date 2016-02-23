/**
 * Created by chinghsu on 16/2/23.
 */
function Coin(opts){
	//默认参数
	this.defaults={
		coinSrc:"coin.png",     //金币图片地址
		audioSrc:"http://download.taobaocdn.com/freedom/26370/media/shake.mp3",	//金币音频地址
		coinWidth:30,           //金币宽度
		coinHeight:30,          //金币高度
		density:300
	};
	this.settings=this._extendDeep(this.defaults,opts);   //深拷贝
	this.density=this.settings.density;                   //密度，即金币个数
	this.timeLag=1000;                                    //金币散落的事件间隔，数字越大表示间隔越大
	this.coinWidth=this.settings.coinWidth;               //金币宽度
	this.coinHeight=this.settings.coinHeight;             //金币高度
	this.wrapWidth=0;
	this.wrapHeight=0;
	this._init();
}
Coin.prototype={
	constructor:Coin,
	/**
	 * 动画初始化方法
	 * @method _init
	 **/
	_init:function(){
		//初始化包括尺寸大小
		this.wrapWidth=document.getElementById("popCoin").clientWidth;
		this.wrapHeight=document.getElementById("popCoin").clientHeight;
		this._requestAnimationFrame();
		this._createCanvas();
		this._createAudio();
	},
	/**
	 * 对象深拷贝方法
	 * @method _extendDeep
	 * @param  {object} parent 父对象
	 {object} child  子对象
	 @return {object} child  父对象继承给子对象
	 **/
	_extendDeep:function(child,parent){
		var i,
			toStr = Object.prototype.toString,
			astr = "[object Array]";
		child = child || {};
		for (i in parent) {
			if (parent.hasOwnProperty(i)) {
				if (typeof parent[i] === "object") {
					child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
					extendDeep(parent[i], child[i]);
				} else {
					child[i] = parent[i];
				}
			}
		}
		return child;
	},
	/**
	 * requestAnimationFrame做兼容
	 * @method _requestAnimationFrame
	 **/
	_requestAnimationFrame:function(){
		var lastTime = 0;
		var vendors = ['webkit', 'moz'];
		for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // name has changed in Webkit
				window[vendors[x] + 'CancelRequestAnimationFrame'];
		}
		if (!window.requestAnimationFrame) {
			window.requestAnimationFrame = function(callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
				var id = window.setTimeout(function() {
					callback(currTime + timeToCall);
				}, timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		}
		if (!window.cancelAnimationFrame) {
			window.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
		}
	},
	/**
	 * 创建canvas画布
	 * @method _createCanvas
	 **/
	_createCanvas:function(){
		var _self=this;
		this.canvas=document.createElement('canvas');
		this.canvas.setAttribute("data-id",Date.now());
		if(!this.canvas.getContext){
			alert("您的浏览器不支持canvas");
			return;
		}
		this.context=this.canvas.getContext('2d');
		this.canvas.width=this.wrapWidth;
		this.canvas.height=this.wrapHeight;
		var oBody=document.getElementById("popCoin");
		oBody.appendChild(this.canvas);
		this._createCacheCanvas();
	},
	_createCacheCanvas:function(){
		var _self=this;
		this.cacheCanvas=document.createElement('canvas');
		this.cacheContext=this.cacheCanvas.getContext('2d');
		this.cacheCanvas.width=this.wrapWidth;
		this.cacheCanvas.height=this.wrapHeight;
		this.coinImg=new Image();
		this.coinImg.src=this.settings.coinSrc;
		this.coinImg.onload=function(){
			_self._startCacheCanvasAnim();
		}
	},
	/**
	 * 执行金币绘制动画
	 * @method _startCanvasAnim
	 **/
	_startCacheCanvasAnim:function(){
		var _self=this;
		var availWidth=this.cacheCanvas.width-this.coinWidth;
		var availHeight=this.cacheCanvas.height-this.coinHeight;
		//var disX=availWidth/this.density;  //每个硬币X轴的间距
		var coinRange=availWidth*this.density/(this.density+15);
		var rangeStart=(availWidth-coinRange)/2;
		var g=4.9*280;   //重力加速度
		var bPlayAudio=false;
		var coinAttrArr=[];  //存储金币下落过程中的一些属性参数
		for(var i=0;i<_self.density;i++){
			coinAttrArr[i]={
				rndX:Math.random(),                                    //存储金币开始降落x轴随机值
				rndOrder:Math.round(Math.random()*_self.timeLag/17),   //存储金币撒落顺序的一个数组
				time:0,									               //存储金币绘制的具体时间
				top:0,                                                 //存储金币绘制距离顶部的距离
				left:0,                                                //存储金币弹起后距离左边的距离
				endSpeed:0,                                            //存储金币第一次接触地面的速度
				bEnd:false,								               //存储金币是否触碰到地面
				reDownSpeed:0,                                         //存储金币弹起后重新降落的速度
				reDownHDelta:Math.random()*100+100,                    //存储金币弹起的高度参数，随机值100~200之间
				rndOffsetX:Math.random()*0.06+0.97                     //存储金币x轴的偏移量，随机值0.97~1.03之间
			}
		}
		var startTime =  Date.now();  //开始绘制前的时间
		function draw(){
			var drawStart = Date.now();  //记录重绘的结束事件
			var diff = (drawStart - startTime)/1000;  //计算每次重绘所需要的事件，单位为秒
			startTime = drawStart;   //结束事件传给开始事件
			_self.context.clearRect(0,0,_self.canvas.width,_self.canvas.height);  //清除画布，方便重绘
			_self.cacheContext.clearRect(0,0,_self.cacheCanvas.width,_self.cacheCanvas.height);  //清除画布，方便重绘
			_self.cacheContext.save();
			//根据金币个数循环绘制金币
			for(var i=0;i<_self.density;i++){
				if((coinAttrArr[i].rndOrder==0&&coinAttrArr[i].time==0)){   //如果顺序为0，表示开始下落，同时下落的初始时间为0时，赋值初始时间
					coinAttrArr[i].time=diff;
				}
				if(coinAttrArr[i].time>0){     //如果初始事件大于0，表示已经在下落过程中,则每次的初始时间递增
					coinAttrArr[i].time=coinAttrArr[i].time+diff;
				}
				if(coinAttrArr[i].rndOrder==0){  //如果顺序为0，开始下落，则开始绘制金币
					if(!coinAttrArr[i].bEnd){   //金币下落（过程一），自由落体运动
						coinAttrArr[i].top=g*Math.pow(coinAttrArr[i].time,2)/2-_self.coinHeight;   //自由落体加速度运动，求下落的高度
						//coinAttrArr[i].left=disX*coinAttrArr[i].rndX+i*disX;
						coinAttrArr[i].left=coinRange*coinAttrArr[i].rndX+rangeStart;
					}else if(coinAttrArr[i].endSpeed==0){   //金币弹起后在空中重新下落（过程三）
						coinAttrArr[i].reDownSpeed=coinAttrArr[i].reDownSpeed*1.1;
						coinAttrArr[i].top=coinAttrArr[i].top+coinAttrArr[i].reDownSpeed;
						coinAttrArr[i].left=coinAttrArr[i].left*coinAttrArr[i].rndOffsetX;
					}else{   //金币弹起（过程二）
						coinAttrArr[i].endSpeed=-Math.abs(coinAttrArr[i].endSpeed*0.96);
						if(Math.abs(coinAttrArr[i].endSpeed)<1) coinAttrArr[i].endSpeed=0;
						coinAttrArr[i].top=coinAttrArr[i].top+coinAttrArr[i].endSpeed;
						coinAttrArr[i].left=coinAttrArr[i].left*coinAttrArr[i].rndOffsetX;
					}
					//金币第一次降落超过地面时，将其高度设置和地面齐平
					if(coinAttrArr[i].top>_self.cacheCanvas.height-_self.coinHeight&&!coinAttrArr[i].bEnd){
						coinAttrArr[i].top=_self.cacheCanvas.height-_self.coinHeight;
					}
					//金币落地时，计算落地的速度
					if(coinAttrArr[i].top==_self.cacheCanvas.height-_self.coinHeight){
						coinAttrArr[i].endSpeed=g*coinAttrArr[i].time/coinAttrArr[i].reDownHDelta;
						coinAttrArr[i].reDownSpeed=coinAttrArr[i].endSpeed/10;
						coinAttrArr[i].bEnd=true;
					}
					//绘制金币
					_self.cacheContext.drawImage(_self.coinImg,coinAttrArr[i].left,coinAttrArr[i].top,_self.coinWidth,_self.coinHeight);
				}
				coinAttrArr[i].rndOrder=coinAttrArr[i].rndOrder==0?0:coinAttrArr[i].rndOrder-1;//顺序每一次重绘则递减一次，直到为0时，代表开始下落
			}
			_self.cacheContext.restore();
			_self.context.drawImage(_self.cacheCanvas,0,0,_self.canvas.width,_self.canvas.height);
			var firstH=_self._maxNum(coinAttrArr,"top");//求降落过程中高度最大的金币高度
			if(firstH>=_self.cacheCanvas.height-_self.coinHeight&&!bPlayAudio){
				_self._playAudio();
				bPlayAudio=true;
			}
			var lastH=_self._minNum(coinAttrArr,"top");//求降落过程中高度最小的金币高度
			if(lastH<=_self.cacheCanvas.height+_self.coinHeight){ //最后一个金币高度超出canvas的高度停止重绘
				window.requestAnimationFrame(draw);  //重绘，递回调用绘制方法
			}else{
				console.log("金币都撒完了");
				_self._destory();
			}
		}
		window.requestAnimationFrame(draw);  //第一次绘制
	},
	/**
	 * 求最小值
	 * @method _minNum
	 * @param   {arr}    arr  属性数组
	 {string} attr 数组下的属性名称
	 * @return  {number}      返回数组下属性值最小的值
	 **/
	_minNum:function(arr,attr){
		var tempArr=[];
		for(var i=0;i<arr.length;i++){
			tempArr.push(arr[i][attr]);
		}
		return tempArr.sort(function(a,b){return a-b})[0];
	},
	/**
	 * 求最大值
	 * @method _minNum
	 * @param   {arr}    arr  属性数组
	 {string} attr 数组下的属性名称
	 * @return  {number}      返回数组下属性值最大的值
	 **/
	_maxNum:function(arr,attr){
		var tempArr=[];
		for(var i=0;i<arr.length;i++){
			tempArr.push(arr[i][attr]);
		}
		return tempArr.sort(function(a,b){return b-a})[0];
	},
	/**
	 * 创建音频对象
	 * @method _createAudio
	 **/
	_createAudio:function(){
		this.audio=document.createElement('audio');
		this.audio.setAttribute("preload","load");
		var oSource=document.createElement('source');
		oSource.setAttribute("src",this.settings.audioSrc);
		oSource.setAttribute("type","audio/mp3");
		this.audio.appendChild(oSource);
		var oBody=document.getElementsByTagName('body')[0];
		oBody.appendChild(this.audio);
	},
	/**
	 * 播放音频
	 * @method _playAudio
	 **/
	_playAudio:function(){
		this.audio.play();
	},
	/**
	 * 销毁canvas和audio
	 * @method _destory
	 **/
	_destory:function(){
		var oBody=document.getElementsByTagName('body')[0];
		oBody.removeChild(this.canvas);
		oBody.removeChild(this.audio);
	}
}



window.onload=function(){
	var oBtn=document.getElementById('btn1');
	init();
	oBtn.onclick=function(){
		var coin=new Coin();
	}
	var SHAKE_THRESHOLD = 400;
	var last_update = 0;
	var index=0;
	var x = y = z = last_x = last_y = last_z = 0;
	var w_curTime=0;
	function init() {
		if (window.DeviceMotionEvent) {
			window.addEventListener('devicemotion', deviceMotionHandler, false);
		} else {
			alert('not support mobile event');
		}
	}
	function deviceMotionHandler(eventData) {
		var acceleration = eventData.accelerationIncludingGravity;
		var curTime = new Date().getTime();
		if ((curTime - last_update) > 100) {
			var diffTime = curTime - last_update;
			last_update = curTime;
			x = acceleration.x;
			y = acceleration.y;
			z = acceleration.z;
			var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
			var delta=Math.abs(x + y + z - last_x - last_y - last_z);
			if (speed > SHAKE_THRESHOLD) {
				if((curTime-w_curTime)>2000){
					w_curTime!=0 && new Coin({density:Math.round(delta)});
					w_curTime=curTime;
				}
			}
			last_x = x;
			last_y = y;
			last_z = z;
		}
	}
}