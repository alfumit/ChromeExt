var id;

chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('extension1.html', {
    'bounds': {
      'width': 960,
      'height': 1280
    }
  });
	 // if(document.getElementById("idHolder")) id = document.getElementById("idHolder").innerHTML;  
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
	  if(document.getElementById("idHolder")) id = document.getElementById("idHolder").innerHTML; 

  var webview = document.getElementById("webpage");
  if(webview){
	  webview.addEventListener("loadstop", function(){
		  //if(document.getElementById("tempo-tracker-actions")) {
			webview.executeScript(
			{code: 'document.getElementById("tempo-tracker-actions").addEventListener("click", function() { alert(document.getElementById("summary-val").innerHTML)}); '},
			  function(results) {
				console.log(results);
			  }
			 );
		  //}
	  });
  }

chrome.serial.getDevices(function(devices) {
	console.log(devices);
	});
	
	
	
	chrome.serial.connect("COM4",{bitrate: 9600},function(info){
		 console.log(info);
	     id = id || info.connectionId;
	     var idHolder = document.createElement("div");
	   idHolder.innerHTML = id;
	   idHolder.id = "idHolder";
	   document.body.appendChild(idHolder);
	   console.log()
		 //chrome.serial.onReceive.addListener(function(incoming) {console.log(incoming)});
		 webview.addEventListener("dialog", function(msg){
          foo = str2ab(msg.messageText);  
		  chrome.serial.send(id,foo,function(info){ console.log("erm ",info)});		  
         });	 
		});		
};

chrome.runtime.onSuspend.addListener(function() {
	// var idHolder = document.createElement("div").innerHTML = id;
	// idHolder.id = "idHolder";
	// document.body.appendChild(idHolder);

  chrome.serial.disconnect(id, function() { console.log("Did it!")});
});






