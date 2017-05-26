var freeWorkers = [];
var callback    = function() {};
var frameData   = [];
var fileData    = [];
var lastSent    = false;
var encTab;

function loadOptions(tabId, targetSrc) {
	chrome.tabs.executeScript(tabId, {code:"(typeof active !== 'undefined')"}, function(response) {
		var loaded = response[0];
		
		if(loaded) {
			chrome.tabs.executeScript(tabId, {code:"init();"});
		} else {
			chrome.tabs.insertCSS(tabId, {file: "main.css"});
			chrome.tabs.executeScript(tabId, {file: "script.js"}, function() {
				chrome.tabs.executeScript(tabId, {code:"init();"});
			});
			
		}
	});
}

function openOnLoad(tabId, info) {
	if(info.status == "complete") {
		loadOptions();
		chrome.tabs.onUpdated.removeListener(openOnLoad);
	}
}

function httpRequest(url, method, fData, onResponse, progress) {
	var req = new XMLHttpRequest();
	
	req.open(method, url, true);
	req.onreadystatechange = function() {
		if(req.readyState === 4) {
			onResponse({"text": req.responseText, "status": req.status});
		}
	}
	
	if(progress) {
		req.upload.onprogress = function(e) {
			if(e.lengthComputable) {
				chrome.tabs.executeScript(null, {code:"setProgress(" + e.loaded + ", " + e.total + ");"});
			}
		}
	}
	
	req.send(fData);
}

function uploadFile(url, onResponse) {
	window.resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL;
	window.resolveLocalFileSystemURL(url, function(fileEntry) {
		fileEntry.file(function(file) {
			var fd = new FormData();

			fd.append("ufile", file);
			fd.append("flags", "BE");
			
			httpRequest("http://makegif.com/upload", "POST", fd, onResponse, true);
		});
	});
}

function contextMenuHandler(info, tab) {
	var srcUrl = (info.menuItemId == "contextvideo" && info.srcUrl != null) ? info.srcUrl : null;
	
	loadOptions(null, srcUrl);
}

function spawnWorkers(maxWorkers) {
	freeWorkers = [];
	
	for(var i = 0; i < maxWorkers; i++) {
		var worker = new Worker('classes/GIFWorker.js');
		
		worker.onmessage = function(e) {
			freeWorkers.push(worker);
			encodeNext(e);
		}
		worker.onerror = function(e) { freeWorkers.push(worker); console.log(e); }
		
		freeWorkers.push(worker);
	}
}

function encodeNext(e) {
	console.log("encodeNext");
	if(e) {
		frameData[e.data['frame_index']] = e.data['data'];
		
		if(e.data['last'] == true) {
			saveGIF();
			return;
		}
	}
	
	if(lastSent) return;
	
	if(freeWorkers.length > 0) {
		chrome.tabs.executeScript(encTab, {code:"getNextFrame();"}, function onFrameData(request) {
			console.log("encodeNext");
			if(request[0].canEncode) {
				var worker = freeWorkers.shift();
				
				lastSent = request[0].last;
				
				worker.postMessage({
					"frame_index": request[0].frame, 
					"frame_length": request[0].frameLength, 
					"width": request[0].width, 
					"height": request[0].height, 
					"quality": request[0].quality, 
					"delay": request[0].delay, 
					"imageData": request[0].imageData, 
					"last": request[0].last
				});
			}
		});
	}
}

function saveGIF(deleteFile) {
	var errorHandler = function(err) {
		console.log(err);
	}
	var dta;
	
	window.webkitRequestFileSystem(window.TEMPORARY, 1024*1024*10, function(fs) {
		if(deleteFile == true) {
			fs.root.getFile('animation.gif', {create: false}, function(fileEntry) {
				fileEntry.remove(function() {  });
			}, errorHandler);
			
			return;
		}
	
		fs.root.getFile('animation.gif', {create: true}, function(fileEntry) {
			fileEntry.createWriter(function(fileWriter) {
				
				fileWriter.onwriteend = function(e) {
					frameData = [];
					fileData = [];
					callback({url: fileEntry.toURL(), size: fileWriter.length});
				};
				
				fileWriter.onerror = function(e) {
					console.log('Write failed: ' + e.toString());
				};
				
				while(dta = frameData.shift()) for(var i = 0; i < dta.length; i++) fileData.push(dta[i]);
				
				var blob = new Blob([new Uint8Array(fileData)], {type: 'image/gif'});
				fileWriter.write(blob);
			}, errorHandler);
		}, errorHandler);
	}, errorHandler);
}

chrome.runtime.onInstalled.addListener(function() {
	var id = chrome.contextMenus.create({"title": "Convert To GIF", "contexts":["video"], "id": "contextvideo"});
});
chrome.runtime.onInstalled.addListener(function() {
	var patterns = ["*://*.youtube.com/*", "*://*.vimeo.com/*"];
	var id = chrome.contextMenus.create({"title": "Convert To GIF", "contexts":["page"], "id": "contextpage", "documentUrlPatterns": patterns});
});

chrome.contextMenus.onClicked.addListener(contextMenuHandler);
chrome.browserAction.onClicked.addListener(function(tab) { loadOptions(); });

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.command == "startEncoding") {
			lastSent = false;
			encTab = sender.tab.id;
			callback = sendResponse;
			frameData = [];
			fileData = [];

			console.log("start");
			
			spawnWorkers(Math.min(4, request.frameLength));
			
			saveGIF(true);
			
			for(var i = 0; i < freeWorkers.length; i++) encodeNext();
			
			return true;
		} else if(request.command == "getEmbed") {
			var code  = 'if(typeof active === \'undefined\' && document.getElementsByTagName("iframe").length > 0) {';
				code += 'var obj = {owner: document.location.href, src: document.getElementsByTagName("iframe")[0].src}; obj;';
				code += '} else { false; }';
					
			chrome.tabs.executeScript(null, {code: code, allFrames: true}, function(resp) {
				var ec = {};
				for(var i = 0; i < resp.length; i++) {
					if(resp[i] != false) ec[resp[i].owner] = resp[i].src;
				}
				sendResponse(ec);
			});
			
			return true;
		} else if(request.command == "upload") {
			var file = request.file;
			
			uploadFile(file, sendResponse);
			
			return true;
		} else if(request.command == "openRequest") {
			chrome.tabs.onUpdated.addListener(openOnLoad);
			sendResponse();
		} else if(request.command == "init") {
			loadOptions();
		}
});


//Inject Buttons
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(changeInfo.status === 'complete') chrome.tabs.executeScript(tabId, {file: "lstr.js"});
});