
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('extension1.html', {
    'bounds': {
      'width': 960,
      'height': 1280
    }
  }, function(app) {
        onload = function() {}
        var webview = document.getElementById("webpage");
		console.log(webview);
       // var indicator = document.querySelector(".indicator");
          //webview.executeScript({ code: "document.body.style.backgroundColor = 'red'" });
		  webview.executeScript(
    {code: 'document.documentElement.innerHTML'},
    function(results) {
      console.log(results);
    });
		//app.contentWindow.addEventListener('DOMContentLoaded', function() {
		//   webview.executeScript({ code: "document.body.style.backgroundColor = 'red'" });			
	//	});	  	  
	  
	  }
  );
});
/*
onload = function() {}
        var webview = document.getElementById("webpage");
        var indicator = document.querySelector(".indicator");

		app.contentWindow.addEventListener('DOMContentLoaded', function() {
		   webview.executeScript({ code: "document.body.style.backgroundColor = 'red'" });			
		});
*/
chrome.serial.getDevices(function(devices) {
	console.log(devices);
});

chrome.runtime.getBackgroundPage(function (url) {
	  console.log(url);
	});	
