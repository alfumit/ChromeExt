chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('extension1.html', {
    'bounds': {
      'width': 960,
      'height': 1280
    }
  });
});


var str2ab = function(str) {
  var encodedString = unescape(encodeURIComponent(str));
  var bytes = new Uint8Array(encodedString.length);
  for (var i = 0; i < encodedString.length; ++i) {
    bytes[i] = encodedString.charCodeAt(i);

  }
  return bytes.buffer;
};
var ab2str = function(buf) {
  var bufView = new Uint8Array(buf);
  var encodedString = String.fromCharCode.apply(null, bufView);
  return decodeURIComponent(escape(encodedString));
};

var foo = str2ab("Default text");

onload = function() {
  var webview = document.getElementById("webpage");
  webview.addEventListener("loadstop", function(){
	webview.executeScript(
    {code: 'document.getElementById("tempo-tracker-actions").addEventListener("click", function() { alert(document.getElementById("summary-val").innerHTML)}); '},
      function(results) {
        console.log(results);
      }
	 ); 	  
  });
  
var id;
chrome.serial.getDevices(function(devices) {
	console.log(devices);
	});
	chrome.serial.connect("COM4",{bitrate: 9600},function(info){
		 console.log(info);
		 //chrome.serial.onReceive.addListener(function(incoming) {console.log(incoming)});
		 id = info.connectionId;
		 webview.addEventListener("dialog", function(msg){
          foo = str2ab(msg.messageText);  
		  chrome.serial.send(id,foo,function(info){ console.log("erm ",info)});		  
         });	 
		});		
};

chrome.runtime.onSuspend.addListener(function() {
   
  chrome.serial.disconnect(id, function() { console.log("Did it!")});
  setTimeout(function(){alert('hi')},10000);
});






