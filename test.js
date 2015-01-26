
var id, combinedStr,tillEnd = "";

chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('extension1.html', {
    'bounds': {
      'width': 960,
      'height': 1000
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
  // BufView contains charCodes and we're looking for "10" the end of line. After we find EOL we return the value to be inserted 
  // we need to save the rest of data sent in global variable and start filling it till the next EOL.
  //If no EOL found than just return an empty line, it wont get inserted
  for(i=0; i<bufView.length;i++) {
    tillEnd += encodedString[i];
	if(bufView[i]==10) {
	//	var c = decodeURIComponent(escape(tillEnd));
	    var c = tillEnd;
		for(j=i;j<bufView.length;j++) {
			tillEnd="";
			tillEnd += encodedString[j];
		}
		return c;
	}
}
  return "";
};

var foo = str2ab("Default text");

onload = function() {
	  if(document.getElementById("idHolder")) id = document.getElementById("idHolder").innerHTML; 

  var webview = document.getElementById("webpage");
  if(webview) {
	webview.addEventListener("loadstop", function(){
	webview.executeScript(
    {code: 'document.getElementById("tempo-tracker-actions").addEventListener("click", function() { alert(document.querySelector(".issue .key a").text+" "+document.querySelector("#issue-tracker-summary-id a").text )}); '},
      function(results) {
        console.log(results);
      }); 	  
	});
  }
  
	chrome.serial.getDevices(function(devices) {
		console.log(devices);
	});

 chrome.runtime.getBackgroundPage(function(html) {
	if(html.document.getElementById("idHolder")) id = parseInt(html.document.getElementById("idHolder").innerHTML);
 
    console.log("Below is a type detection");
	console.log(id);
	if(!id) {
		chrome.serial.connect("COM4",{bitrate: 9600},function(info){
			console.log(info);
			//chrome.serial.onReceive.addListener(function(incoming) {console.log("QQ "+incoming)});
			id = info.connectionId;
			var idHolder = document.createElement("div");
			idHolder.id = "idHolder";
			idHolder.innerHTML = id;
			document.body.appendChild(idHolder);
			webview.addEventListener("dialog", function(msg){
				foo = str2ab(msg.messageText);  
				chrome.serial.send(id,foo,function(info){ console.log("erm ",info)});		  
			});	 
		});
    } else {
		chrome.serial.onReceive.addListener(function(incoming) {
		    var stringRes = ab2str(incoming.data);
			if(stringRes.indexOf("temp")!=-1)  document.getElementsByClassName("temp")[0].innerHTML = stringRes.substr(7,stringRes.length-7);
			if(stringRes.indexOf("lx")!=-1) document.getElementsByClassName("lx")[0].innerHTML =  stringRes.substr(5,stringRes.length-5);
		});
		console.log("Found id on background page ");
		webview.addEventListener("dialog", function(msg){
			foo = str2ab(msg.messageText);
			chrome.serial.send(id,foo,function(info){ console.log("Result ",info)});		  
        });  
	}
 });	
};


chrome.runtime.onSuspend.addListener(function() {
	chrome.serial.disconnect(id, function(x) { console.log("Did it! "+x)});
});






