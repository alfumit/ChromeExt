	var match = new chrome.declarativeWebRequest.RequestMatcher({
			  url: {hostSuffix: "kaspersky.com"} });



    var greeting = "hello, ";
    var button = document.getElementById("mybutton");
    button.person_name = "Bob";
    button.addEventListener("click", function() {
      console.log("OOO");
      console.log(match);
	  console.log("ZZZZ");
    }, false);