
var ccid = "IterYoutubeGIF";
var active     = true;
var oBox       = null;
var elCont     = null;
var source     = null;
var elements   = {};
var events     = [];
var frames     = [];
var embeds     = {};
var image      = null;
var timer      = null;
var btnTimer = null;  // 170529 김영덕 추가
var effectTimer = null;
var viewTimer  = null;
var cFrame     = 0;
var capturing  = false;
var playing    = false;
var settOpen   = false;
var frameCount = 0;
var vScale     = 1;
var cfWidth    = 320, cfHeight = 240;
var localFile  = "";
var fileSize   = 0;
var sizeMB     = 0;
var crop       = false;
var cbX        = 0, cbY = 0, cbW = 200, cbH = 150;
var cropX      = 0, cropY = 0;
var srcWidth   = 0, srcHeight = 0;
var getNextFrame;
var outputName = null;

var cQuality     = "Medium";
var cFPS         = 12;
var cMaxFrames   = 500;
var cSize = 320;
var injectButton = true;

var userLan    = 'en';
var userMsg    = new Array();
var FORMAT_LABEL={'18':'MP4 360p','22':'MP4 720p','43':'WebM 360p','44':'WebM 480p','45':'WebM 720p','46':'WebM 1080p','135':'MP4 480p - no audio','137':'MP4 1080p - no audio','138':'MP4 2160p - no audio','140':'M4A 128kbps - audio','264':'MP4 1440p - no audio','266':'MP4 2160p - no audio','298':'MP4 720p60 - no audio','299':'MP4 1080p60 - no audio'};
  var FORMAT_TYPE={'18':'mp4','22':'mp4','43':'webm','44':'webm','45':'webm','46':'webm','135':'mp4','137':'mp4','138':'mp4','140':'m4a','264':'mp4','266':'mp4','298':'mp4','299':'mp4'};
  var FORMAT_ORDER=['18','43','135','44','22','298','45','137','299','46','264','138','266','140'];
  var FORMAT_RULE={'mp4':'all','webm':'none','m4a':'all'};
  // all=display all versions, max=only highest quality version, none=no version  
  // the default settings show all MP4 videos
  var SHOW_DASH_FORMATS=false;
  var BUTTON_TEXT={'ar':'تنزيل','cs':'Stáhnout','de':'Herunterladen','en':'Download','es':'Descargar','fr':'Télécharger','hi':'डाउनलोड','hu':'Letöltés','id':'Unduh','it':'Scarica','ja':'ダウンロード','ko':'내려받기','pl':'Pobierz','pt':'Baixar','ro':'Descărcați','ru':'Скачать','tr':'İndir','zh':'下载','zh-TW':'下載'};
  var BUTTON_TOOLTIP={'ar':'تنزيل هذا الفيديو','cs':'Stáhnout toto video','de':'Dieses Video herunterladen','en':'Download this video','es':'Descargar este vídeo','fr':'Télécharger cette vidéo','hi':'वीडियो डाउनलोड करें','hu':'Videó letöltése','id':'Unduh video ini','it':'Scarica questo video','ja':'このビデオをダウンロードする','ko':'이 비디오를 내려받기','pl':'Pobierz plik wideo','pt':'Baixar este vídeo','ro':'Descărcați acest videoclip','ru':'Скачать это видео','tr': 'Bu videoyu indir','zh':'下载此视频','zh-TW':'下載此影片'};
  var DECODE_RULE=[];
  var RANDOM=7489235179; // Math.floor(Math.random()*1234567890);
  var CONTAINER_ID='download-youtube-video'+RANDOM;
  var LISTITEM_ID='download-youtube-video-fmt'+RANDOM;
  var BUTTON_ID='download-youtube-video-button'+RANDOM;
  var DEBUG_ID='download-youtube-video-debug-info';
  var STORAGE_URL='download-youtube-script-url';
  var STORAGE_CODE='download-youtube-signature-code';
  var STORAGE_DASH='download-youtube-dash-enabled';
  var isDecodeRuleUpdated=false;  
  var playbackUrl;

var qOptions    = ["High", "Medium", "Low"];
var sizeOptions = ["50", "100", "150", "256", "320", "448"];
var fpsOptions  = ["1", "5", "7.5", "10", "15", "20", "30"];
var mfOptions   = ["10", "50", "100", "200", "500", "1000"];

// 170529 김영덕 추가
var framesBuff = [];
var firstFrame = null;

start();

function init() {
	if(elements[ccid]) return;
	active = true;
	oBox = ne(document.body, 'div', {id: ccid});
	//ne(oBox, 'video', {src: playbackUrl, id : "playbackVideo", crossOrigin : "anonymous", controls: "controls", width : "480px", height : "280px"});
	//document.getElementById("playbackVideo").setAttribute('style', 'display:none;');
	//ne(oBox, 'img', {src: chrome.extension.getURL('images/record.png'), id: 'recordBtn', class: 'menuIcon', title: 'Record'});
	//ne(oBox, 'img', {src: chrome.extension.getURL('images/stop.png'), id: 'encodeBtn', class: 'menuIcon', title: 'Encode'});
	//addEvent(elements["recordBtn"], 'click', startCapture, "options");
    //addEvent(elements["encodeBtn"], 'click', generate, "options");
    //addEvent(elements["recordBtn"], 'click', generate, "options");
    var logo = ne(oBox, 'div', { id: "extLogo", class: "extLogo" });
    ne(logo, 'div', { id: "logo1", class: "logo1" }, "GIF Convertor for Youtube");
    ne(logo, 'div', { id: "logo2", class: "logo2" }, "Converted GIF: " + cFPS + "fps, " + cQuality + " Quality, " + cSize + "px Size");

    ne(oBox, 'div', { id: "resultBox", class: "resultBox" });

    var menuBar = ne(oBox, 'div', { id: "extMenuBar", class: "extMenuBar" });

    var tmpElemt = ne(menuBar, 'span', { id: "extSettings" });
    ne(tmpElemt, 'img', { src: chrome.extension.getURL('images/settings.png'), width: "12px", height: "12px" });
    ne(tmpElemt, 'span', {}, 'Settings');

    var tmpElemt = ne(menuBar, 'div', { id: "settingMenu1", class: "settingMenu" });
    ne(tmpElemt, 'span', { class: "settingName" }, "FPS");
    tmpElemt = ne(tmpElemt, 'span', { class: "settingContainer" });
    ne(tmpElemt, 'span', { class: "settingItem", param: 12 }, "12");
    ne(tmpElemt, 'span', { class: "settingItem", param: 15 }, "15");
    ne(tmpElemt, 'span', { class: "settingItem", param: 24 }, "24");
    ne(tmpElemt, 'span', { class: "settingItem", param: 30 }, "30");

    var tmpElemt = ne(menuBar, 'div', { id: "settingMenu2", class: "settingMenu" });
    ne(tmpElemt, 'span', { class: "settingName" }, "Quality");
    tmpElemt = ne(tmpElemt, 'span', { class: "settingContainer" });
    ne(tmpElemt, 'span', { class: "settingItem", param: "High" }, "High");
    ne(tmpElemt, 'span', { class: "settingItem", param: "Medium" }, "Medium");
    ne(tmpElemt, 'span', { class: "settingItem", param: "Low" }, "Low");

    var tmpElemt = ne(menuBar, 'div', { id: "settingMenu3", class: "settingMenu" });
    ne(tmpElemt, 'span', { class: "settingName" }, "Width");
    tmpElemt = ne(tmpElemt, 'span', { class: "settingContainer" });
    ne(tmpElemt, 'span', { class: "settingItem", param: 150 }, "150");
    ne(tmpElemt, 'span', { class: "settingItem", param: 256 }, "256");
    ne(tmpElemt, 'span', { class: "settingItem", param: 320 }, "320");
    ne(tmpElemt, 'span', { class: "settingItem", param: 448 }, "448");

    var tmpElemt = ne(menuBar, 'div', { id: "confirmSetting", class: "confirmSetting" }, "Applying.....");

    var btnTimes = ne(menuBar, 'span', { id: "btnTimes" });
    tmpElemt = ne(btnTimes, 'span', { id: "btnTime5", class: "btnTime", title: "Extract 5 Seconds" });
    ne(tmpElemt, 'img', { src: chrome.extension.getURL('images/timeback.png'), width: "12px", height: "12px" });
    ne(tmpElemt, 'span', {}, '5s');
    tmpElemt = ne(btnTimes, 'span', { id: "btnTime10", class: "btnTime", title: "Extract 10 Seconds" });
    ne(tmpElemt, 'img', { src: chrome.extension.getURL('images/timeback.png'), width: "12px", height: "12px" });
    ne(tmpElemt, 'span', {}, '10s');

    addEvent(elements["btnTime5"], 'click', function (e) { generate(e, 5); }, "options");
    addEvent(elements["btnTime10"], 'click', function (e) { generate(e, 10); }, "options");
    // 170529 김영덕 추가
    //addEvent(elements["playbackVideo"], 'play', startCapture, "options");
    //addEvent(elements["playbackVideo"], 'pause', pauseCapture, "options");
    findVideo();

    $("#extSettings").click(function () {
        pauseCapture();
        $(this).hide("slow", function () {
            $('#settingMenu1 .settingContainer .settingItem[param="' + cFPS + '"]').css("background-color", "#00CE00");
            $("#settingMenu1").show("fast");
        });
    });

    $("#settingMenu1 .settingContainer .settingItem").click(function (e) {
        $('#settingMenu1 .settingContainer .settingItem[param="' + cFPS + '"]').css("background-color", "black");
        setSetting("f", $(this).attr("param"));
        $("#settingMenu1").hide("slow", function () {
            $('#settingMenu2 .settingContainer .settingItem[param="' + cQuality + '"]').css("background-color", "#00CE00");
            $("#settingMenu2").show("fast");
        });
    });
    $("#settingMenu2 .settingContainer .settingItem").click(function (e) {
        $('#settingMenu2 .settingContainer .settingItem[param="' + cQuality + '"]').css("background-color", "black");
        setSetting("q", $(this).attr("param"));
        $("#settingMenu2").hide("slow", function () {
            $('#settingMenu3 .settingContainer .settingItem[param="' + cSize + '"]').css("background-color", "#00CE00");
            $("#settingMenu3").show("fast");
        });
    });
    $("#settingMenu3 .settingContainer .settingItem").click(function (e) {
        $('#settingMenu3 .settingContainer .settingItem[param="' + cSize + '"]').css("background-color", "black");
        setSetting("w", $(this).attr("param"));
        $("#settingMenu3").hide("slow", function () {
            $("#confirmSetting").show("fast", function () {
                $("#confirmSetting").delay(500).hide("slow", function () {
                    $("#extSettings").show("fast");
                    $("#logo2").hide("slow", function () {
                        clearInterval(btnTimer);
                        btnTimer = setInterval(applyBtnCSS, 500);
                        frameCount = 0;
                        framesBuff = [];
                        if (source.played) {
                            startCapture();
                        }
                        $(this).text("Converted GIF: " + cFPS + "fps, " + cQuality + " Quality, " + cSize + "px Size").show("fast");
                    });
                });
            });
        });
    });
}

function setSetting(type, value) {
    if (type === "f") {
        cFPS = value;
    } else if (type === "q") {
        cQuality = value;
    } else if (type === "w") {
        cSize = value;
    }
}

function loadSettings() {
	cFPS         = (localStorage["cfps"]) ? localStorage["cfps"] : 12;
	cMaxFrames   = (localStorage["cmaxframe"]) ? localStorage["cmaxframe"] : 500;
	cQuality     = (localStorage["cquality"]) ? localStorage["cquality"] : "Medium";
	cSize        = (localStorage["csize"]) ? localStorage["csize"] : 320;
	injectButton = (localStorage["injectBtn"]) ? localStorage["injectBtn"] : true;
}


function getQuality() {
	var q = 10;
	
	switch(cQuality) {
		case "High": q = 1; break;
		case "Medium": q = 10; break;
		case "Low": q = 20; break;
		default: q = 10;
	}
	
	return q;
}

function addEvent(target, e, callback, eventGroup) {
	if(eventGroup == null) eventGroup = "main";
	target.addEventListener(e, callback);
	events.push({"eventGroup":eventGroup, "target":target, "e":e, "callback":callback});
}

function addEvents(elementArr, callback) {
	for(var i = 0; i < elementArr.length; i++) {
		addEvent(elementArr[i], 'click', callback, "main");
	}
}

function removeEvents(eventGroup) {
	for(var i = events.length - 1; i >= 0; i--) {
		if(eventGroup == null || events[i].eventGroup == eventGroup) {
			events[i].target.removeEventListener(events[i].e, events[i].callback);
			events.splice(i, 1);
		}
	}
}

function ne(parent, element, attr, intxt) {
	var el = document.createElement(element);
	
	for(var key in attr) {
		el.setAttribute(key, attr[key]);
	}
	if(intxt)  el.textContent = intxt;
	if('id' in attr) elements[attr['id']] = el;
	if(parent) parent.appendChild(el);
	
	return el;
}

function ce(parent, element, attr, intxt){
	if(document.getElementById(attr['id']) ==null)
		return;

	var el = document.getElementById(attr['id']);

	for(var key in attr) {
		el.setAttribute(key, attr[key]);
	}
	if(intxt)  el.textContent = intxt;
	if('id' in attr) elements[attr['id']] = el;
	if(parent) parent.appendChild(el);
	
	return el;
}

function de(element) {
	element.parentNode.removeChild(element);
	if(typeof elements[element.id] !== 'undefined') delete elements[element.id];
}

function getVideoElements() {
	//console.log(elements["playbackVideo"]);
	//return elements["playbackVideo"];
	return document.getElementsByTagName('video');
}

function getVideoEmbed(ec) {
	if(!ec) {
		chrome.runtime.sendMessage({command: "getEmbed"}, getVideoEmbed);
		return;
	}
	
	var iframes = document.getElementsByTagName('iframe');
	var found   = 0;
	var eid     = 0;
	embeds = {};
	
	for(var i = 0; i < iframes.length; i++) {
		var subSrc   = (ec && ec[iframes[i].src]) ? ec[iframes[i].src] : false;
		var siteInfo = checkSite(iframes[i].src, subSrc);
		
		if(siteInfo && siteInfo.videoLink != null) {
			eid = (iframes[i].id != "") ? iframes[i].id : (iframes[i].id = ("videoEmbed" + i));
			embeds[eid] = siteInfo;
			found++;
		}
	}
	
	if(found == 1) {
		setOptions('prompt', getMsg('BreakOut'), function(e) {
			embedRedirect(eid);
		}, closeOptions);
	} else if(found > 1) {
		setOptions('msg', getMsg('EmbededVideo'));
	}
}

function embedRedirect(eid) {
	var siteInfo = embeds[eid];
	if(siteInfo && siteInfo.videoLink != null) redirect(siteInfo.videoLink, true);
}

function videoClick(e) {
	var et = e.target || e.srcElement;
	selectVideoElement(et);
	e.stopPropagation();
}

function videoLoaded(e) {
	var et = e.target || e.srcElement;
	removeEvents("videoLoad");
	selectVideoElement(et);
}

function onSeeking(e) {
    //170529 김영덕 수정
	//pauseCapture(false);
	console.log("onSeeking");
    if (capturing){
    	pauseCapture(false);
    }
        
}

function onSeeked(e) {
    //170529 김영덕 수정
	//clearQueue();
    console.log("onSeeked");
    clearInterval(btnTimer);
    btnTimer = setInterval(applyBtnCSS, 500);
    frameCount = 0;
    framesBuff = [];
    if (capturing) {
        startCapture();
    }
}

function onPaused(e) {
    console.log("onPaused");
    if (capturing) {
        pauseCapture(false);
    }
}

function selectVideoElement(videoElement) {
	console.log(videoElement);
	source    = videoElement;
	srcWidth  = source.videoWidth;
	srcHeight = source.videoHeight;
	
	console.log(source);
	
	if(source.readyState !== 4) {
        addEvent(source, 'canplay', videoLoaded, "videoLoad");
		return;
	}
	
	addEvent(source, 'seeking', onSeeking, "seekControl");
    addEvent(source, 'seeked', onSeeked, "seekControl");
    addEvent(source, 'pause', onPaused, "videoState");
    addEvent(source, 'play', startCapture, "videoState");

	try {
		var testImage = getFrameImage(source, 0.1);
		var testCtx   = testImage.getContext('2d');
		var testData  = testCtx.getImageData(0,0, testCtx.canvas.width, testCtx.canvas.height).data;
		
	} catch(err) {
		var vsrc = source.src;
		var CORSErr = err.code == 18 || err.name == "SecurityError";
			
		if(!vsrc) {
			var re = /\ssrc=(?:(?:'([^']*)')|(?:"([^"]*)")|([^\s]*))/i, res = source.innerHTML.match(re);
			vsrc = res[1]||res[2]||res[3];
		}
		
		console.log(err.message);
    }

    if (!capturing) {
        if (source.played) {
            startCapture();
        }
    }
}

// 170529 김영덕 추가
function applyBtnCSS() {
    var buffLen = framesBuff.length;
    var btn5 = document.getElementById("btnTime5");
    var btn10 = document.getElementById("btnTime10");
    if (buffLen >= (cFPS * 10)) {
        btn5.style["backgroundColor"] = "#00CE00";
        btn10.style["backgroundColor"] = "#00CE00";
        clearInterval(btnTimer);
    } else if (buffLen < (cFPS * 10)) {
        if (buffLen < (cFPS * 5)) {
            btn5.style["backgroundColor"] = "#FF758F";
            btn10.style["backgroundColor"] = "#FF758F";
        } else {
            btn5.style["backgroundColor"] = "#00CE00";
            btn10.style["backgroundColor"] = "#FF758F";
        }
    }
}

function findVideo() {
	//var videoElements = getVideoElements();
	//console.log(videoElements)
	//selectVideoElement(videoElements);
	
	var videoElements = getVideoElements();
	
	console.log(videoElements);
	
	if(videoElements.length == 1) {
		selectVideoElement(videoElements[0]);
	} else if(videoElements.length > 1) {
		addEvents(videoElements, videoClick);
		selectVideoElement(videoElements[0]);
		//setOptions('msg', getMsg('ClickVideo'));
	} else {
		var siteInfo = checkSite(document.location.href);
		
		if(siteInfo.html5Disabled) {
			setOptions('prompt', getMsg('HTML5Disabled'), siteInfo.html5EnableAction, closeOptions);
		} else if(siteInfo.html5Redirect) {
			setOptions('prompt', getMsg('FlashVideo'), function() {
				redirect(siteInfo.html5URL, true);
			}, closeOptions);
		} else {
			setOptions('prompt', getMsg('NoVideo'), findVideo);
			setOptionsButtons(getMsg('Retry'));
			
			getVideoEmbed();
		}
	}

}

var cBufferMaxFrames = 30;
var framesFront = 0;
var framesRear = 0;

function startCapture(e) {
    // 170529 김영덕 수정
	//if(!capturing && frameCount < cMaxFrames) {
    if (!capturing) {
		if(source.paused) {
			source.play();
			source.muted = true;
		}

		if(frames.length < 1) {
			vScale = cSize / srcWidth;
			
			cfWidth  = cSize;
			cfHeight = srcHeight * vScale;
		}
		
		var delay = 1000 / cFPS;
		//var et = e.target || e.srcElement;
		
        timer = setInterval(captureFrame, delay);
        // 170529 김영덕 추가: 버튼에 버퍼링 가능할시 표시되도록
        btnTimer = setInterval(applyBtnCSS, 500);

        // 김영덕 주석처리
		//et.value = "Pause";
		capturing = true;
		//elements["recordBtn"].src = chrome.extension.getURL('images/recording.png');
    }
    //else {
	//	if(!source.paused) source.pause();
	//	pauseCapture(frameCount >= cMaxFrames);
	//}
}

function pauseCapture(maxReach) {
	capturing = false;
    clearInterval(timer);
    // 170529 김영덕: btnTimer추가
    clearInterval(btnTimer);
    // 170529 김영덕 주석처리
	//elements["recordBtn"].value = "Start";
	//elements["recordBtn"].src = chrome.extension.getURL('images/record.png');
}

function captureFrame(e) {
    // 170529 김영덕 주석처리 및 코드 추가
    frameCount++;
    if (frameCount >= cMaxFrames)
        framesBuff.shift(); // 버퍼의 맨앞의 요소 제거
    framesBuff.push(getFrameImage(source)); // 버퍼의 맨뒤에 요소 추가
}

function stopCapture(e) {
	capturing = false;
	clearInterval(timer);
	
	if(e) {
		if(frames.length > 0) playPreview(e, true, false);
	}
}

var framesForGIF = new Array();
var gifFramesCounter = new Array();
var gifNum = 0;

function generate(e, seconds) {

    var resultBox = document.getElementById("resultBox");

    var progressItem = ne(resultBox, 'div', { class: "resultProgressItem" });
    //ne(progressItem, 'div', { class: "resultProgressBg" }, "0% Completed");
    ne(progressItem, 'div', { class: "resultProgressBg" });
    var progressBar = ne(progressItem, 'div', { class: "resultProgressBar" });
    ne(progressItem, 'div', { class: "resultProgressCaption" }, "0% Completed");

    $(progressItem).show("fast", function () {
        if ($(resultBox).outerHeight() > 400) {
            $(resultBox).animate({ "scrollTop": $(progressItem).offset().top }, 500);
        }
    });

    // 170529 김영덕 추가 : 버퍼의 내용을 frames배열로 복사
    frames = framesBuff;
    frames = frames.slice(0);

    framesForGIF[gifNum] = new Array();
    framesForGIF[gifNum] = frames.slice(frames.length - (cFPS*seconds));
    gifFramesCounter[gifNum] = 0;

    console.log("generate Start. cFPS is " + cFPS);
    // 170529 김영덕 추가 : framesFront 계산 (어디서부터 추출할것인지)
    if (frames.length >= (cFPS * seconds))
        framesFront = frames.length - (cFPS * seconds);
    frames = frames.slice(framesFront); // 이렇게하면 무조건 0번부터 끝까지 쭉 추출하면됨
    framesRear = frames.length - 1;
	var cFrame  = 0;
	var quality = getQuality();
	var delay   = 1000 / cFPS;
    var width = frames[0].width;
    var height = frames[0].height;
    firstFrame = frames[0];

	getNextFrame = function() {
		if(cFrame > frames.length) {
			return {canEncode: false};
		} 
        console.log("generate : " + cFrame + "/" + (frames.length - 1));
        var progressPercent = cFrame / (frames.length - 1) * 100;
        $("#resultBox .resultProgressItem .resultProgressBar").css("width", progressPercent + "%");
        $("#resultBox .resultProgressItem .resultProgressCaption").text(progressPercent.toFixed(0) + "% Completed")
        // 170529 김영덕 주석처리
		return {
			canEncode: true, 
			frame: cFrame, 
			frameLength: frames.length, 
			width: width, 
			height: height, 
			quality: quality, 
			delay: delay, 
			imageData: frames[cFrame++].getContext('2d').getImageData(0, 0, width, height).data,
            // 이 조건이 맞으면 탈출
            last: (cFrame == framesRear)
		}
	}
	
	chrome.runtime.sendMessage({command: "startEncoding", frameLength: frames.length, outputName: outputName}, encodingComplete);
}

var showFramesTimer = new Array;
var imgDiv = new Array();
function encodingComplete(response) {
    console.log("size : " + response.size);
	localFile = response.url;
	fileSize  = response.size;
	sizeMB    = fileSize / 1048576;

	//if(gifNum > 1)
		//ce(oBox, 'a', {href: localFile, download: 'animation' + gifNum.toString(), id: 'saveLink' + gifNum.toString()},  'GIF 다운로드 ');
	//else
    var resultBox = document.getElementById("resultBox");
    // 2017.06.07 김영덕 수정
    var resultItem = ne(resultBox, 'div', { class: "resultItem"});
    //var downloadItem = ne(resultBox, 'a', { href: localFile, download: 'animation' + gifNum.toString(), id: 'saveLink' + gifNum.toString(), class: "downloadBtn" });
    var downloadItem = ne(resultItem, 'a', { href: localFile, download: outputName + gifNum.toString(), id: 'saveLink' + gifNum.toString(), class: "downloadBtn" });
	ne(downloadItem, 'img' , {src : chrome.extension.getURL('images/download.png'), class : "downloadImage"});
	
	//ne(oBox, 'canvas', {id: 'canvas1', width : "32", height : "18"});
	//canvasBox = elements["canvas1"];
	//ctx = canvasBox.getContext('2d');
	//ctx.drawImage(canvas, 0, 0, 32, 18);
	
	//ne(resultBox, 'canvas' , {id : "firstFrame" , width : "160", height : "90"});
	//var thumbnailBox = elements["firstFrame"];
	//var ctx1 = thumbnailBox.getContext('2d');
	//ctx1.drawImage(firstFrame, 0, 0, 145, 80);
	
	// 현재 gif index
	var nowGif = gifNum;
	// 첫번째 프레임을 따와서
    imgDiv[nowGif] = ne(resultItem, 'div', {id: "imgDiv" + nowGif});

    // 2017.06.06 김영덕 추가
    var xIMG = new XMLHttpRequest();
    xIMG.open('GET', localFile);
    xIMG.responseType = 'blob';
    xIMG.onload = function () {
        var blob = xIMG.response;
        var fr = new FileReader();
        fr.onloadend = function () {
            ne(imgDiv[nowGif], 'img', { src: fr.result, id: 'framesImg' + nowGif, width: "160", height: "90" });
        };
        fr.readAsDataURL(blob);
    };
    xIMG.send();

    $(".resultProgressItem").hide("fast", function () {
        $(resultItem).show("slow", function () {
            if ($("#resultBox").outerHeight() > 400) {
                $("#resultBox").animate({ "scrollTop": $(this).offset().top }, 500);
            }
        });
        $(this).remove();
    });

    //var imageSrc = framesForGIF[gifNum][0].toDataURL("image/png");
	// img 태그 생성
	//ne(imgDiv[nowGif], 'img', {src:imageSrc, id:'framesImg' + nowGif, width : "160", height : "90"});
	// interval 시작
	//showFramesTimer[nowGif] = setInterval(function(){
	//	showFrames(null, nowGif);
	//}, 100);
	// a 태그 생성
	//ne(imgDiv[nowGif], 'a', {href: localFile, download: 'animation' + nowGif.toString(), id: 'saveLink' + nowGif.toString()},  'GIF 다운로드 ');

	gifNum++;
}

function showFrames(e, gifIndex){
	var imageSrc = framesForGIF[gifIndex][gifFramesCounter[gifIndex]++].toDataURL("image/png");
	ce(imgDiv[gifIndex], 'img', {src:imageSrc, id:'framesImg' + gifIndex});
	if(gifFramesCounter[gifIndex] == framesForGIF[gifIndex].length - 1)
		gifFramesCounter[gifIndex] = 1;
}

function hideItem(url){
	alert(url);
	document.getElementById(url).setAttribute('style', 'display:none;');
}


function getFrameImage(video) {
    var canvas = document.createElement('canvas');
        canvas.width  = cfWidth;
        canvas.height = cfHeight;
	    if(!crop) canvas.getContext('2d').drawImage(video, 0, 0, cfWidth, cfHeight);
		else canvas.getContext('2d').drawImage(video, cropX, cropY, srcWidth, srcHeight, 0, 0, cfWidth, cfHeight);
	
	//ne(oBox, 'canvas', {id: 'canvas1', width : "32", height : "18"});
	//canvasBox = elements["canvas1"];
	//ctx = canvasBox.getContext('2d');
	//ctx.drawImage(canvas, 0, 0, 32, 18);	
    return canvas;
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function start() {
  var pagecontainer=document.getElementById('page-container');
  if (!pagecontainer) return;
  if (/^https?:\/\/www\.youtube.com\/watch\?/.test(window.location.href)) run();       
  var isAjax=/class[\w\s"'-=]+spf\-link/.test(pagecontainer.innerHTML);
  var logocontainer=document.getElementById('logo-container');  
  if (logocontainer && !isAjax) { // fix for blocked videos
    isAjax=(' '+logocontainer.className+' ').indexOf(' spf-link ')>=0;
  }
  var content=document.getElementById('content');
  if (isAjax && content) { // Ajax UI
      var mo=window.MutationObserver||window.WebKitMutationObserver;
      if(typeof mo!=='undefined') {
        var observer=new mo(function(mutations) {
          mutations.forEach(function(mutation) {
              if(mutation.addedNodes!==null) {
                for (var i=0; i<mutation.addedNodes.length; i++) {
                    if (mutation.addedNodes[i].id == 'watch7-main-container') { // || id=='watch7-container'
                        // 2017.06.07 김영덕 추가;
                        clearInterval(btnTimer);
                        btnTimer = setInterval(applyBtnCSS, 500);
                        frameCount = 0;
                        framesBuff = [];
                      run();
                      break;
                    }
                }
              }
          });
        });
        observer.observe(content, {childList: true, subtree: true}); // old value: pagecontainer
      } else { // MutationObserver fallback for old browsers
        pagecontainer.addEventListener('DOMNodeInserted', onNodeInserted, false);
      }
  } 
}

function onNodeInserted(e) { 
    if (e && e.target && (e.target.id=='watch7-main-container')) { // || id=='watch7-container'
      run();
  }
}
  
function run() {
  if (document.getElementById(CONTAINER_ID)) return; // check download container
    
  var videoID, videoFormats, videoAdaptFormats, videoManifestURL, scriptURL=null;
  var isSignatureUpdatingStarted=false;
  var operaTable=new Array();
  var language=document.documentElement.getAttribute('lang');
  var textDirection='left';
  if (document.body.getAttribute('dir')=='rtl') {
    textDirection='right';
  }
  if (document.getElementById('watch7-action-buttons')) {  // old UI
    fixTranslations(language, textDirection);
  }
        
  // obtain video ID, formats map   
  
  var args=null;
  var usw=(typeof this.unsafeWindow !== 'undefined')?this.unsafeWindow:window; // Firefox, Opera<15
  if (usw.ytplayer && usw.ytplayer.config && usw.ytplayer.config.args) {
    args=usw.ytplayer.config.args;
  }
  if (args) {
      videoID = args['video_id']; 
      // 2017.06.07 김영덕 추가
      outputName = videoID;
    videoFormats=args['url_encoded_fmt_stream_map'];
    videoAdaptFormats=args['adaptive_fmts'];
    videoManifestURL=args['dashmpd'];
    debug('DYVAM - Info: Standard mode. videoID '+(videoID?videoID:'none')+'; ');
  }
  if (usw.ytplayer && usw.ytplayer.config && usw.ytplayer.config.assets) {
    scriptURL=usw.ytplayer.config.assets.js;
  }  
  
  if (videoID==null) { // unsafeWindow workaround (Chrome, Opera 15+)
    var buffer=document.getElementById(DEBUG_ID+'2');
    if (buffer) {
      while (buffer.firstChild) {
        buffer.removeChild(buffer.firstChild);
      }
    } else {
      buffer=createHiddenElem('pre', DEBUG_ID+'2');
    }    
    injectScript ('if(ytplayer&&ytplayer.config&&ytplayer.config.args){document.getElementById("'+DEBUG_ID+'2").appendChild(document.createTextNode(\'"video_id":"\'+ytplayer.config.args.video_id+\'", "js":"\'+ytplayer.config.assets.js+\'", "dashmpd":"\'+ytplayer.config.args.dashmpd+\'", "url_encoded_fmt_stream_map":"\'+ytplayer.config.args.url_encoded_fmt_stream_map+\'", "adaptive_fmts":"\'+ytplayer.config.args.adaptive_fmts+\'"\'));}');
    var code=buffer.innerHTML;
    if (code) {
        videoID = findMatch(code, /\"video_id\":\s*\"([^\"]+)\"/);
        // 2017.06.07 김영덕 추가
        outputName = videoID;
      videoFormats=findMatch(code, /\"url_encoded_fmt_stream_map\":\s*\"([^\"]+)\"/);
      videoFormats=videoFormats.replace(/&amp;/g,'\\u0026');
      videoAdaptFormats=findMatch(code, /\"adaptive_fmts\":\s*\"([^\"]+)\"/);
      videoAdaptFormats=videoAdaptFormats.replace(/&amp;/g,'\\u0026');
      videoManifestURL=findMatch(code, /\"dashmpd\":\s*\"([^\"]+)\"/);
      scriptURL=findMatch(code, /\"js\":\s*\"([^\"]+)\"/);
    }
    debug('DYVAM - Info: Injection mode. videoID '+(videoID?videoID:'none')+'; ');
  }
     
  if (videoID==null) { // if all else fails
    var bodyContent=document.body.innerHTML;  
    if (bodyContent!=null) {
        videoID = findMatch(bodyContent, /\"video_id\":\s*\"([^\"]+)\"/);
        // 2017.06.07 김영덕 추가
        outputName = videoID;
      videoFormats=findMatch(bodyContent, /\"url_encoded_fmt_stream_map\":\s*\"([^\"]+)\"/);
      videoAdaptFormats=findMatch(bodyContent, /\"adaptive_fmts\":\s*\"([^\"]+)\"/);
      videoManifestURL=findMatch(bodyContent, /\"dashmpd\":\s*\"([^\"]+)\"/);
      if (scriptURL==null) {
        scriptURL=findMatch(bodyContent, /\"js\":\s*\"([^\"]+)\"/);
        if (scriptURL) {
          scriptURL=scriptURL.replace(/\\/g,'');
        }
      }      
    }
    debug('DYVAM - Info: Brute mode. videoID '+(videoID?videoID:'none')+'; ');
  }
  
  debug('DYVAM - Info: url '+window.location.href+'; useragent '+window.navigator.userAgent);  
  
  if (videoID==null || videoFormats==null || videoID.length==0 || videoFormats.length==0) {
   debug('DYVAM - Error: No config information found. YouTube must have changed the code.');
   return;
  }
  
  // Opera 12 extension message handler
  if (typeof window.opera !== 'undefined' && window.opera && typeof opera.extension !== 'undefined') {
    opera.extension.onmessage = function(event) {
      var index=findMatch(event.data.action, /xhr\-([0-9]+)\-response/);
      if (index && operaTable[parseInt(index,10)]) {
        index=parseInt(index,10);
        var trigger=(operaTable[index])['onload'];
        if (typeof trigger === 'function' && event.data.readyState == 4) {
          if (trigger) {
              trigger(event.data);         
          }
        }
      }
    }
  }
    
  if (!isDecodeRuleUpdated) {
    DECODE_RULE=getDecodeRules(DECODE_RULE);
    isDecodeRuleUpdated=true;
  }
  if (scriptURL) {
    scriptURL = absoluteURL(scriptURL);
    debug('DYVAM - Info: Full script URL: '+scriptURL);
    fetchSignatureScript(scriptURL);
  }
  
   // video title
   var videoTitle=document.title || 'video';
   videoTitle=videoTitle.replace(/\s*\-\s*YouTube$/i, '').replace(/'/g, '\'').replace(/^\s+|\s+$/g, '').replace(/\.+$/g, '');
   videoTitle=videoTitle.replace(/[:"\?\*]/g, '').replace(/[\|\\\/]/g, '_'); // Mac, Linux, Windows
   if (((window.navigator.userAgent || '').toLowerCase()).indexOf('windows') >= 0) {
      videoTitle=videoTitle.replace(/#/g, '').replace(/&/g, '_'); // Windows
   } else {
      videoTitle=videoTitle.replace(/#/g, '%23').replace(/&/g, '%26'); //  Mac, Linux
   }
                        
  // parse the formats map
  var sep1='%2C', sep2='%26', sep3='%3D';
  if (videoFormats.indexOf(',')>-1||videoFormats.indexOf('&')>-1||videoFormats.indexOf('\\u0026')>-1) { 
    sep1=','; 
    sep2=(videoFormats.indexOf('&')>-1)?'&':'\\u0026'; 
    sep3='=';
  }
  var videoURL=new Array();
  var videoSignature=new Array();
  if (videoAdaptFormats) {
    videoFormats=videoFormats+sep1+videoAdaptFormats;
  }
  var videoFormatsGroup=videoFormats.split(sep1);
  for (var i=0;i<videoFormatsGroup.length;i++) {
    var videoFormatsElem=videoFormatsGroup[i].split(sep2);
    var videoFormatsPair=new Array();
    for (var j=0;j<videoFormatsElem.length;j++) {
      var pair=videoFormatsElem[j].split(sep3);
      if (pair.length==2) {
        videoFormatsPair[pair[0]]=pair[1];
      }
    }
    if (videoFormatsPair['url']==null) continue;
    var url=unescape(unescape(videoFormatsPair['url'])).replace(/\\\//g,'/').replace(/\\u0026/g,'&');
    if (videoFormatsPair['itag']==null) continue;
    var itag=videoFormatsPair['itag'];
    var sig=videoFormatsPair['sig']||videoFormatsPair['signature'];
    if (sig) {
      url=url+'&signature='+sig;
      videoSignature[itag]=null;
    } else if (videoFormatsPair['s']) {
      url=url+'&signature='+decryptSignature(videoFormatsPair['s']);
      videoSignature[itag]=videoFormatsPair['s'];
    }
    if (url.toLowerCase().indexOf('ratebypass')==-1) { // speed up download for dash
      url=url+'&ratebypass=yes';
    }
    if (url.toLowerCase().indexOf('http')==0) { // validate URL
      videoURL[itag]=url+'&title='+videoTitle;
    }
  }
    
  var showFormat=new Array();
  for (var category in FORMAT_RULE) {
    var rule=FORMAT_RULE[category];
    for (var index in FORMAT_TYPE){
      if (FORMAT_TYPE[index]==category) {
        showFormat[index]=(rule=='all');
      }
    }
    if (rule=='max') {
      for (var i=FORMAT_ORDER.length-1;i>=0;i--) {
        var format=FORMAT_ORDER[i];
        if (FORMAT_TYPE[format]==category && videoURL[format]!=undefined) {
          showFormat[format]=true;
          break;
        }
      }
    }
  }
  
  var dashPref=getPref(STORAGE_DASH);
  if (dashPref=='1') {
    SHOW_DASH_FORMATS=true;
  } else if (dashPref!='0') {
    setPref(STORAGE_DASH,'0');
  }
  
  var downloadCodeList=[];
  for (var i=0;i<FORMAT_ORDER.length;i++) {
    var format=FORMAT_ORDER[i];
    if (format=='37' && videoURL[format]==undefined) { // hack for dash 1080p
      if (videoURL['137']) {
       format='137';
      }
      showFormat[format]=showFormat['37'];
    } else if (format=='38' && videoURL[format]==undefined) { // hack for dash 4K
      if (videoURL['138'] && !videoURL['266']) {
       format='138';
      }
      showFormat[format]=showFormat['38'];
    }    
    if (!SHOW_DASH_FORMATS && format.length>2) continue;
    if (videoURL[format]!=undefined && FORMAT_LABEL[format]!=undefined && showFormat[format]) {
      downloadCodeList.push({url:videoURL[format],sig:videoSignature[format],format:format,label:FORMAT_LABEL[format]});
      console.log(downloadCodeList);
      debug('DYVAM - Info: itag'+format+' url:'+videoURL[format]);
    }
  }  
  
  if (downloadCodeList.length==0) {
    debug('DYVAM - Error: No download URL found. Probably YouTube uses encrypted streams.');
    return; // no format
  } 
    
  // find parent container
  var newWatchPage=false;
  var parentElement=document.getElementById('watch7-action-buttons');
  if (parentElement==null) {
    parentElement=document.getElementById('watch8-secondary-actions');
    if (parentElement==null) {
      debug('DYVAM Error - No container for adding the download button. YouTube must have changed the code.');
      return;
    } else {
      newWatchPage=true;
    }
  }
  
  // get button labels
  var buttonText=(BUTTON_TEXT[language])?BUTTON_TEXT[language]:BUTTON_TEXT['en'];
  var buttonLabel=(BUTTON_TOOLTIP[language])?BUTTON_TOOLTIP[language]:BUTTON_TOOLTIP['en'];
    
  // generate download code for regular interface
  var mainSpan=document.createElement('span');

  if (newWatchPage) {
    var spanIcon=document.createElement('span');
    spanIcon.setAttribute('class', 'yt-uix-button-icon-wrapper');
    var imageIcon=document.createElement('img');
    imageIcon.setAttribute('src', '//s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif');
    imageIcon.setAttribute('class', 'yt-uix-button-icon');
    imageIcon.setAttribute('style', 'width:20px;height:20px;background-size:20px 20px;background-repeat:no-repeat;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABG0lEQVRYR+2W0Q3CMAxE2wkYAdiEEWADmIxuACMwCmzABpCTEmRSO7YTQX+ChECV43t2nF7GYeHPuLD+0AKwC/DnWMAp/N5qimkBuAfBdRTF/+2/AV6ZYFUxVYuicAfoHegd6B3oHfhZB+ByF+JyV8FkrAB74pqH3DU5L3iGoBURhdVODIQF4EjEkWLmmhYALOQgNIBcHHke4buhxXAAaFnaAhqbQ5QAOHHkwhZ8balkx1ICCiEBWNZ+CivdB7REHIC2ZjZK2oWklDDdB1NSdCd/Js2PqQMpSIKYVcM8kE6QCwDBNRCqOBJrW0CL8kCYxL0A1k6YxWsANAiXeC2ABOEWbwHAWrwxpzgkmA/JtIqnxTOElmPnjlkc4A3FykAhA42AxwAAAABJRU5ErkJggg==);');
    spanIcon.appendChild(imageIcon);
    mainSpan.appendChild(spanIcon);
  }

  var spanButton=document.createElement('span');
  spanButton.setAttribute('class', 'yt-uix-button-content');
  spanButton.appendChild(document.createTextNode(buttonText+' '));
  mainSpan.appendChild(spanButton);
  
  if (!newWatchPage) { // old UI
    var imgButton=document.createElement('img');
    imgButton.setAttribute('class', 'yt-uix-button-arrow');
    imgButton.setAttribute('src', '//s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif');
    mainSpan.appendChild(imgButton);
  }

  var listItems=document.createElement('ol');
  listItems.setAttribute('style', 'display:none;');
  listItems.setAttribute('class', 'yt-uix-button-menu');
  for (var i=0;i<downloadCodeList.length;i++) {
    var listItem=document.createElement('li');
    var listLink=document.createElement('a');
    listLink.setAttribute('style', 'text-decoration:none;');
    listLink.setAttribute('href', downloadCodeList[i].url);
    listLink.setAttribute('download', videoTitle+'.'+FORMAT_TYPE[downloadCodeList[i].format]);
    var listButton=document.createElement('span');
    listButton.setAttribute('class', 'yt-uix-button-menu-item');
    listButton.setAttribute('loop', i+'');
    listButton.setAttribute('id', LISTITEM_ID+downloadCodeList[i].format);
    listButton.appendChild(document.createTextNode(downloadCodeList[i].label));
    listLink.appendChild(listButton);
    listItem.appendChild(listLink);
    listItems.appendChild(listItem);
  }
  mainSpan.appendChild(listItems);
  var buttonElement=document.createElement('button');
  buttonElement.setAttribute('id', BUTTON_ID);
  if (newWatchPage) {
    buttonElement.setAttribute('class', 'yt-uix-button  yt-uix-button-size-default yt-uix-button-opacity yt-uix-tooltip');
  } else { // old UI
    buttonElement.setAttribute('class', 'yt-uix-button yt-uix-tooltip yt-uix-button-empty yt-uix-button-text');
    buttonElement.setAttribute('style', 'margin-top:4px; margin-left:'+((textDirection=='left')?5:10)+'px;');
  }
  buttonElement.setAttribute('data-tooltip-text', buttonLabel);  
  buttonElement.setAttribute('type', 'button');
  buttonElement.setAttribute('role', 'button');
  buttonElement.addEventListener('click', function(){return false;}, false);
  buttonElement.appendChild(mainSpan);
  var containerSpan=document.createElement('span');
  containerSpan.setAttribute('id', CONTAINER_ID);
  containerSpan.appendChild(document.createTextNode(' '));
  containerSpan.appendChild(buttonElement);
                                            
  // add the button
  if (!newWatchPage) { // watch7
    parentElement.appendChild(containerSpan);
  } else { // watch8
    parentElement.insertBefore(containerSpan, parentElement.firstChild);
  }
    
  // REPLACEWITH if (!isSignatureUpdatingStarted) {
    for (var i=0;i<downloadCodeList.length;i++) { 
      addFileSize(downloadCodeList[i].url, downloadCodeList[i].format);
    }
  // } 
  
  if (typeof GM_download !== 'undefined') {
    for (var i=0;i<downloadCodeList.length;i++) {
      var downloadFMT=document.getElementById(LISTITEM_ID+downloadCodeList[i].format);
      var url=(downloadCodeList[i].url).toLowerCase();
      if (url.indexOf('clen=')>0 && url.indexOf('dur=')>0 && url.indexOf('gir=')>0
          && url.indexOf('lmt=')>0) {
        downloadFMT.addEventListener('click', downloadVideoNatively, false);
      }
    }
  }

  playbackUrl = downloadCodeList[0].url;
  
  addFromManifest();
  
  function downloadVideoNatively(e) {
    var elem=e.currentTarget;
    e.returnValue=false;    
    if (e.preventDefault) {
      e.preventDefault();
    }
    var loop=elem.getAttribute('loop');
    if (loop) {
      GM_download(downloadCodeList[loop].url, videoTitle+'.'+FORMAT_TYPE[downloadCodeList[loop].format]);
    }
    return false;
  }
  
  function addFromManifest() { // add Dash URLs from manifest file
    var formats=['137', '138', '140']; // 137=1080p, 138=4k, 140=m4a
    var isNecessary=true;
    for (var i=0;i<formats.length;i++) {
      if (videoURL[formats[i]]) {
        isNecessary=false;
        break;
      }
    }
    if (videoManifestURL && SHOW_DASH_FORMATS && isNecessary) {
      var matchSig=findMatch(videoManifestURL, /\/s\/([a-zA-Z0-9\.]+)\//i);
      if (matchSig) {
        var decryptedSig=decryptSignature(matchSig);
        if (decryptedSig) {
          videoManifestURL=videoManifestURL.replace('/s/'+matchSig+'/','/signature/'+decryptedSig+'/');
        }
      }
      videoManifestURL=absoluteURL(videoManifestURL);
      debug('DYVAM - Info: manifestURL '+videoManifestURL);
      crossXmlHttpRequest({
          method:'GET',
          url:videoManifestURL, // check if URL exists
          onload:function(response) {
            if (response.readyState === 4 && response.status === 200 && response.responseText) {
              debug('DYVAM - Info: maniestFileContents '+response.responseText);
              var lastFormatFromList=downloadCodeList[downloadCodeList.length-1].format;
              debug('DYVAM - Info: lastformat: '+lastFormatFromList);
              for (var i=0;i<formats.length;i++) {
                k=formats[i];
                if (videoURL[k] || showFormat[k]==false) continue;
                var regexp = new RegExp('<BaseURL>(http[^<]+itag\\/'+k+'[^<]+)<\\/BaseURL>','i');
                var matchURL=findMatch(response.responseText, regexp);
                debug('DYVAM - Info: matchURL itag= '+k+' url= '+matchURL);
                if (!matchURL) continue;
                matchURL=matchURL.replace(/&amp\;/g,'&');
                // ...
                downloadCodeList.push(
                  {url:matchURL,sig:videoSignature[k],format:k,label:FORMAT_LABEL[k]});
                var downloadFMT=document.getElementById(LISTITEM_ID+lastFormatFromList);
                var clone=downloadFMT.parentNode.parentNode.cloneNode(true);
                clone.firstChild.firstChild.setAttribute('id', LISTITEM_ID+k);
                clone.firstChild.setAttribute('href', matchURL);
                downloadFMT.parentNode.parentNode.parentNode.appendChild(clone);
                downloadFMT=document.getElementById(LISTITEM_ID+k);
                downloadFMT.firstChild.nodeValue=FORMAT_LABEL[k];
                addFileSize(matchURL, k);
                lastFormatFromList=k;
              }
            }
          } 
        });
    }  
  }
  
  function injectStyle(code) {
    var style=document.createElement('style');
    style.type='text/css';
    style.appendChild(document.createTextNode(code));
    document.getElementsByTagName('head')[0].appendChild(style);
  }
  
  function injectScript(code) {
    var script=document.createElement('script');
    script.type='application/javascript';
    script.textContent=code;
    document.body.appendChild(script);
    document.body.removeChild(script);
  }    
  
  function debug(str) {
    var debugElem=document.getElementById(DEBUG_ID);
    if (!debugElem) {
      debugElem=createHiddenElem('div', DEBUG_ID);
    }
    debugElem.appendChild(document.createTextNode(str+' '));
  }
  
  function createHiddenElem(tag, id) {
    var elem=document.createElement(tag);
    elem.setAttribute('id', id);
    elem.setAttribute('style', 'display:none;');
    document.body.appendChild(elem);
    return elem;
  }
  
  function fixTranslations(language, textDirection) {  
    if (/^af|bg|bn|ca|cs|de|el|es|et|eu|fa|fi|fil|fr|gl|hi|hr|hu|id|it|iw|kn|lv|lt|ml|mr|ms|nl|pl|ro|ru|sl|sk|sr|sw|ta|te|th|uk|ur|vi|zu$/.test(language)) { // fix international UI
      var likeButton=document.getElementById('watch-like');
      if (likeButton) {
        var spanElements=likeButton.getElementsByClassName('yt-uix-button-content');
        if (spanElements) {
          spanElements[0].style.display='none'; // hide like text
        }
      }
      var marginPixels=10;
      if (/^bg|ca|cs|el|eu|hr|it|ml|ms|pl|sl|sw|te$/.test(language)) {
        marginPixels=1;
      }
      injectStyle('#watch7-secondary-actions .yt-uix-button{margin-'+textDirection+':'+marginPixels+'px!important}');
    }
  }
  
  function findMatch(text, regexp) {
    var matches=text.match(regexp);
    return (matches)?matches[1]:null;
  }
  
  function isString(s) {
    return (typeof s==='string' || s instanceof String);
  }
    
  function isInteger(n) {
    return (typeof n==='number' && n%1==0);
  }
  
  function absoluteURL(url) {
    var link = document.createElement('a');
    link.href = url;
    return link.href;
  }
  
  function getPref(name) { // cross-browser GM_getValue
    var a='', b='';
    try {a=typeof GM_getValue.toString; b=GM_getValue.toString()} catch(e){}    
    if (typeof GM_getValue === 'function' && 
    (a === 'undefined' || b.indexOf('not supported') === -1)) {
      return GM_getValue(name, null); // Greasemonkey, Tampermonkey, Firefox extension
    } else {
        var ls=null;
        try {ls=window.localStorage||null} catch(e){}
        if (ls) {
          return ls.getItem(name); // Chrome script, Opera extensions
        }
    }
    return;
  }
  
  function setPref(name, value) { //  cross-browser GM_setValue
    var a='', b='';
    try {a=typeof GM_setValue.toString; b=GM_setValue.toString()} catch(e){}    
    if (typeof GM_setValue === 'function' && 
    (a === 'undefined' || b.indexOf('not supported') === -1)) {
      GM_setValue(name, value); // Greasemonkey, Tampermonkey, Firefox extension
    } else {
        var ls=null;
        try {ls=window.localStorage||null} catch(e){}
        if (ls) {
          return ls.setItem(name, value); // Chrome script, Opera extensions
        }
    }
  }
  
  function crossXmlHttpRequest(details) { // cross-browser GM_xmlhttpRequest
    if (typeof GM_xmlhttpRequest === 'function') { // Greasemonkey, Tampermonkey, Firefox extension, Chrome script
      GM_xmlhttpRequest(details);
    } else if (typeof window.opera !== 'undefined' && window.opera && typeof opera.extension !== 'undefined' && 
               typeof opera.extension.postMessage !== 'undefined') { // Opera 12 extension
        var index=operaTable.length;
        opera.extension.postMessage({'action':'xhr-'+index, 'url':details.url, 'method':details.method});
        operaTable[index]=details;
    } else if (typeof window.opera === 'undefined' && typeof XMLHttpRequest === 'function') { // Opera 15+ extension
        var xhr=new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            if (details['onload']) {
              details['onload'](xhr);
            }
          }
        }
        xhr.open(details.method, details.url, true);
        xhr.send();
    }
  }
   
  function addFileSize(url, format) {
  
    function updateVideoLabel(size, format) {
      var elem=document.getElementById(LISTITEM_ID+format);
      if (elem) {
        size=parseInt(size,10);
        if (size>=1073741824) {
          size=parseFloat((size/1073741824).toFixed(1))+' GB';
        } else if (size>=1048576) {
          size=parseFloat((size/1048576).toFixed(1))+' MB';
        } else {
          size=parseFloat((size/1024).toFixed(1))+' KB';
        }
        if (elem.childNodes.length>1) {
            elem.lastChild.nodeValue=' ('+size+')';
        } else if (elem.childNodes.length==1) {
            elem.appendChild(document.createTextNode(' ('+size+')'));
        }
      }
    }
        
    var matchSize=findMatch(url, /[&\?]clen=([0-9]+)&/i);
    if (matchSize) {
      updateVideoLabel(matchSize, format);
    } else {
      try {
        crossXmlHttpRequest({
          method:'HEAD',
          url:url,
          onload:function(response) {
            if (response.readyState == 4 && response.status == 200) { // add size
              var size=0;
              if (typeof response.getResponseHeader === 'function') {
                size=response.getResponseHeader('Content-length');
              } else if (response.responseHeaders) {
                  var regexp = new RegExp('^Content\-length: (.*)$','im');
                  var match = regexp.exec(response.responseHeaders);
                  if (match) {
                    size=match[1];
                  }
              }
              if (size) {
                updateVideoLabel(size, format);
              }
            }
          }
        });
      } catch(e) { }
    }
  }
  
  function findSignatureCode(sourceCode) {
    debug('DYVAM - Info: signature start '+getPref(STORAGE_CODE));
    var signatureFunctionName = 
    findMatch(sourceCode, 
    /\.set\s*\("signature"\s*,\s*([a-zA-Z0-9_$][\w$]*)\(/)
    || findMatch(sourceCode, 
    /\.sig\s*\|\|\s*([a-zA-Z0-9_$][\w$]*)\(/)
    || findMatch(sourceCode, 
    /\.signature\s*=\s*([a-zA-Z_$][\w$]*)\([a-zA-Z_$][\w$]*\)/); //old
    if (signatureFunctionName == null) return setPref(STORAGE_CODE, 'error');
    signatureFunctionName=signatureFunctionName.replace('$','\\$');    
    var regCode = new RegExp(signatureFunctionName + '\\s*=\\s*function' +
    '\\s*\\([\\w$]*\\)\\s*{[\\w$]*=[\\w$]*\\.split\\(""\\);\n*(.+);return [\\w$]*\\.join');
    var regCode2 = new RegExp('function \\s*' + signatureFunctionName +
    '\\s*\\([\\w$]*\\)\\s*{[\\w$]*=[\\w$]*\\.split\\(""\\);\n*(.+);return [\\w$]*\\.join');    
    var functionCode = findMatch(sourceCode, regCode) || findMatch(sourceCode, regCode2);
    debug('DYVAM - Info: signaturefunction ' + signatureFunctionName + ' -- ' + functionCode);            
    if (functionCode == null) return setPref(STORAGE_CODE, 'error');
    
    var reverseFunctionName = findMatch(sourceCode, 
    /([\w$]*)\s*:\s*function\s*\(\s*[\w$]*\s*\)\s*{\s*(?:return\s*)?[\w$]*\.reverse\s*\(\s*\)\s*}/);
    debug('DYVAM - Info: reversefunction ' + reverseFunctionName);
    if (reverseFunctionName) reverseFunctionName=reverseFunctionName.replace('$','\\$');        
    var sliceFunctionName = findMatch(sourceCode, 
    /([\w$]*)\s*:\s*function\s*\(\s*[\w$]*\s*,\s*[\w$]*\s*\)\s*{\s*(?:return\s*)?[\w$]*\.(?:slice|splice)\(.+\)\s*}/);
    debug('DYVAM - Info: slicefunction ' + sliceFunctionName);
    if (sliceFunctionName) sliceFunctionName=sliceFunctionName.replace('$','\\$');    
    
    var regSlice = new RegExp('\\.(?:'+'slice'+(sliceFunctionName?'|'+sliceFunctionName:'')+
    ')\\s*\\(\\s*(?:[a-zA-Z_$][\\w$]*\\s*,)?\\s*([0-9]+)\\s*\\)'); // .slice(5) sau .Hf(a,5)
    var regReverse = new RegExp('\\.(?:'+'reverse'+(reverseFunctionName?'|'+reverseFunctionName:'')+
    ')\\s*\\([^\\)]*\\)');  // .reverse() sau .Gf(a,45)
    var regSwap = new RegExp('[\\w$]+\\s*\\(\\s*[\\w$]+\\s*,\\s*([0-9]+)\\s*\\)');
    var regInline = new RegExp('[\\w$]+\\[0\\]\\s*=\\s*[\\w$]+\\[([0-9]+)\\s*%\\s*[\\w$]+\\.length\\]');
    var functionCodePieces=functionCode.split(';');
    var decodeArray=[];
    for (var i=0; i<functionCodePieces.length; i++) {
      functionCodePieces[i]=functionCodePieces[i].trim();
      var codeLine=functionCodePieces[i];
      if (codeLine.length>0) {
        var arrSlice=codeLine.match(regSlice);
        var arrReverse=codeLine.match(regReverse);
        debug(i+': '+codeLine+' --'+(arrSlice?' slice length '+arrSlice.length:'') +' '+(arrReverse?'reverse':''));
        if (arrSlice && arrSlice.length >= 2) { // slice
        var slice=parseInt(arrSlice[1], 10);
        if (isInteger(slice)){ 
          decodeArray.push(-slice);
        } else return setPref(STORAGE_CODE, 'error');
      } else if (arrReverse && arrReverse.length >= 1) { // reverse
        decodeArray.push(0);
      } else if (codeLine.indexOf('[0]') >= 0) { // inline swap
          if (i+2<functionCodePieces.length &&
          functionCodePieces[i+1].indexOf('.length') >= 0 &&
          functionCodePieces[i+1].indexOf('[0]') >= 0) {
            var inline=findMatch(functionCodePieces[i+1], regInline);
            inline=parseInt(inline, 10);
            decodeArray.push(inline);
            i+=2;
          } else return setPref(STORAGE_CODE, 'error');
      } else if (codeLine.indexOf(',') >= 0) { // swap
        var swap=findMatch(codeLine, regSwap);      
        swap=parseInt(swap, 10);
        if (isInteger(swap) && swap>0){
          decodeArray.push(swap);
        } else return setPref(STORAGE_CODE, 'error');
      } else return setPref(STORAGE_CODE, 'error');
      }
    }
    
    if (decodeArray) {
      setPref(STORAGE_URL, scriptURL);
      setPref(STORAGE_CODE, decodeArray.toString());
      DECODE_RULE=decodeArray;
      debug('DYVAM - Info: signature '+decodeArray.toString()+' '+scriptURL);
      // update download links and add file sizes
      for (var i=0;i<downloadCodeList.length;i++) {        
        var elem=document.getElementById(LISTITEM_ID+downloadCodeList[i].format);
        var url=downloadCodeList[i].url;
        var sig=downloadCodeList[i].sig;
        if (elem && url && sig) {
          url=url.replace(/\&signature=[\w\.]+/, '&signature='+decryptSignature(sig));
          elem.parentNode.setAttribute('href', url);
          addFileSize(url, downloadCodeList[i].format);
        }
      }
    }
  }
  
  function isValidSignatureCode(arr) { // valid values: '5,-3,0,2,5', 'error'
    if (!arr) return false;
    if (arr=='error') return true;
    arr=arr.split(',');
    for (var i=0;i<arr.length;i++) {
      if (!isInteger(parseInt(arr[i],10))) return false;
    }
    return true;
  }
  
  function fetchSignatureScript(scriptURL) {
    var storageURL=getPref(STORAGE_URL);
    var storageCode=getPref(STORAGE_CODE);
    if (!(/,0,|^0,|,0$|\-/.test(storageCode))) storageCode=null; // hack for only positive items
    if (storageCode && isValidSignatureCode(storageCode) && storageURL &&
        scriptURL==absoluteURL(storageURL)) return;
    try {
      debug('DYVAM fetch '+scriptURL);
      isSignatureUpdatingStarted=true;    
      crossXmlHttpRequest({
        method:'GET',
        url:scriptURL,
        onload:function(response) {
          debug('DYVAM fetch status '+response.status);
          if (response.readyState === 4 && response.status === 200 && response.responseText) {
            findSignatureCode(response.responseText);
          }
        } 
      });
    } catch(e) { }
  }
  
  function getDecodeRules(rules) {
    var storageCode=getPref(STORAGE_CODE);    
    if (storageCode && storageCode!='error' && isValidSignatureCode(storageCode)) {
      var arr=storageCode.split(',');
      for (var i=0; i<arr.length; i++) {
        arr[i]=parseInt(arr[i], 10);
      }
      rules=arr;
      debug('DYVAM - Info: signature '+arr.toString()+' '+scriptURL);
    }
    return rules;
  }
  
  function decryptSignature(sig) {
    function swap(a,b){var c=a[0];a[0]=a[b%a.length];a[b]=c;return a};
    function decode(sig, arr) { // encoded decryption
      if (!isString(sig)) return null;
      var sigA=sig.split('');
      for (var i=0;i<arr.length;i++) {
        var act=arr[i];
        if (!isInteger(act)) return null;
        sigA=(act>0)?swap(sigA, act):((act==0)?sigA.reverse():sigA.slice(-act));
      }
      var result=sigA.join('');
      return result;
    }
    
    if (sig==null) return '';    
    var arr=DECODE_RULE;
    if (arr) {
      var sig2=decode(sig, arr);
      if (sig2) return sig2;
    } else {
      setPref(STORAGE_URL, '');
      setPref(STORAGE_CODE, '');
    }
    return sig; 
  }  
  }