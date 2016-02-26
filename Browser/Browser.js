/**
 * Created by chinghsu on 16/2/26.
 */

//var Sys = {};
//var ua = navigator.userAgent.toLowerCase();
//var s;
//(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
//	(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
//		(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
//			(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
//				(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
//
////以下进行测试
//if (Sys.ie) document.write('IE: ' + Sys.ie);
//if (Sys.firefox) document.write('Firefox: ' + Sys.firefox);
//if (Sys.chrome) document.write('Chrome: ' + Sys.chrome);
//if (Sys.opera) document.write('Opera: ' + Sys.opera);
//if (Sys.safari) document.write('Safari: ' + Sys.safari);


var client = function () {
	var engine = {
		ie: 0,
		gecko: 0,
		webkit: 0,
		khtml: 0,
		opera: 0,
		ver: null
	};

	var browser = {
		ie: 0,
		firefox: 0,
		safari: 0,
		konq: 0,
		opera: 0,
		chrome: 0,
		ver: null
	};

	var system = {
		win: false,
		mac: false,
		xll: false,
		iphone: false,
		ipoad: false,
		ipad: false,
		ios: false,
		android: false,
		nokiaN: false,
		winMobile: false,
		wii: false,
		ps: false
	};

	var screen = {
		width: 0,
		height: 0
	};

	var info = {};

	var screenSpec = {
		"iPhone 4S or iPhone 4": "320 * 480",
		"iPhone 5 or iPhone 5s or iPhone 5c": "320 * 568",
		"iPhone 6 or iPhone 6s": "375 * 667",
		"iPhone 6 Plus or iPhone 6s Plus": "414 * 736"
	}

	var ua = navigator.userAgent;
	// 检测浏览器呈现引擎
	if (window.opera) {
		engine.ver = browser.ver = window.opera.version();
		engine.opera = browser.opera = parseFloat(engine.ver);
	} else if (/AppleWebkit\/(\S+)/i.test(ua)) {
		engine.ver = RegExp['$1'];
		engine.webkit = parseFloat(engine.ver);

		// 确定是Chrome还是Safari
		if (/Chrome\/(\S+)/i.test(ua)) {
			browser.ver = RegExp['$1'];
			browser.chrome = parseFloat(browser.ver);
		} else if (/Version\/(\S+)/i.test(ua)) {
			browser.ver = RegExp['$1'];
			browser.safari = parseFloat(browser.ver);
		} else {
			// 近似地确定版本号
			var safariVersion = 1;
			if (engine.webkit < 100) {
				safariVersion = 1;
			} else if (engine.webkit < 312) {
				safariVersion = 1.2;
			} else if (engine.webkit < 412) {
				safariVersion = 1.3;
			} else {
				safariVersion = 2;
			}

			browser.safari = browser.safari = safariVersion;
		}
	} else if (/KHTML\/(\S+)/i.test(ua) || /Konqueror\/([^;]+)/i.test(ua)) {
		engine.ver = browser.ver = RegExp['$1'];
		engine.khtml = browser.konq = parseFloat(engine.ver);
	} else if (/rv:([^\)]+)\) Gecko\/\d{8}/i.test(ua)) {
		engine.ver = RegExp['$1'];
		engine.gecko = parseFloat(engine.ver);

		// 确定是不是Firefox
		if (/Firefox\/(\S+)/i.test(ua)) {
			engine.ver = browser.ver = RegExp['$1'];
			engine.firefox = parseFloat(browser.ver);
		}
	} else if (/MSIE ([^;]+)/i.test(ua)) {
		engine.ver = browser.ver = RegExp['$1'];
		engine.ie = browser.ie = parseFloat(engine.ver);
	}

	// 检测平台
	var p = navigator.platform;
	system.win = p.indexOf('Win') == 0;
	system.mac = p.indexOf('Mac') == 0;
	system.xll = (p.indexOf('Xll') == 0 || p.indexOf('Linux') == 0);

	// 检测Windows操作系统
	if (system.win) {
		if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
			if (RegExp['$1'] == 'NT') {
				switch (RegExp['$2']) {
					case '5.0':
						system.win = '2000';
						break;
					case '5.1':
						system.win = 'XP';
						break;
					case '6.0':
						system.win = 'Vista';
						break;
					case '6.1':
						system.win = '7';
						break;
					case '6.2':
						system.win = '8';
						break;
					default:
						system.win = 'NT';
						break;
				}
			} else if (RegExp['$1'] == '9x') {
				system.win = 'ME';
			} else {
				system.win = RegExp['$1'];
			}
		}
	}

	// 移动设备
	system.iphone = ua.indexOf('iPhone') > -1;
	system.ipod = ua.indexOf('iPod') > -1;
	system.ipad = ua.indexOf('iPad') > -1;
	system.nokiaN = ua.indexOf('nokiaN') > -1;

	// windows mobile
	if (system.win == 'CE') {
		system.winMobile = system.win;
	} else if (system.win == 'Ph') {
		if (/Windows Phone OS (\d+.\d)/i.test(ua)) {
			system.win = 'Phone';
			system.winMobile = parseFloat(RegExp['$1']);
		}
	}

	// 检测IOS版本
	if (system.mac && ua.indexOf('Mobile') > -1) {
		if (/CPU (?:iPhone )?OS (\d+_\d+)/i.test(ua)) {
			system.ios = parseFloat(RegExp['$1'].replace('_', '.'));
		} else {
			system.ios = 2;        // 不能真正检测出来，所以只能猜测
		}
	}

	// 检测Android版本
	if (/Android (\d+\.\d+)/i.test(ua)) {
		system.android = parseFloat(RegExp['$1']);
	}

	// 游戏系统
	system.wii = ua.indexOf('Wii') > -1;
	system.ps = /PlayStation/i.test(ua);


	screen.width = window.screen.width;
	screen.height = window.screen.height;

	info.lang = navigator.language;
	for (var sys in system) {
		if (system[sys]) {
			info.browser = sys + " " + system[sys];
		}
	}

	for (var ver in screenSpec) {
		if (screenSpec[ver] == (screen.width + " * " + screen.height)) {
			info.version = ver;
		}
	}

	return {
		engine: engine,
		browser: browser,
		system: system,
		screen: screen,
		online: navigator.onLine,
		lang: navigator.systemLanguage || navigator.language,
		userlang: navigator.userLanguage,
		colorDepth: navigator.colorDepth,
		info: info
	}
}();