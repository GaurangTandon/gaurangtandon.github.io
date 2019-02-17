var cssPath = "../css/",
	cssResources = ["bootstrap.min.css", "rrssb.css", "index.css"],
	jsPath = "../js/",
	jsResources = {
		preload: ["jqslim.min.js"],
		mainload: ["bootstrap.min.js", "rrssb.min.js", "nav.js"]
	};

function appendLink(URL){
	var link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = URL;
	document.head.appendChild(link);
}

appendLink("https://fonts.googleapis.com/css?family=Lato:700");
cssResources.forEach(function(cssResource) {
	appendLink(cssPath + cssResource);
});


function loadJSResources(resources) {
	resources.forEach(function(jsResource) {
		var script = document.createElement("script");
		script.src = jsPath + jsResource;
		document.head.appendChild(script);
	});
}

loadJSResources(jsResources.preload);

(function loadMainScripts() {
	if (window.$) {
		loadJSResources(jsResources.mainload);
	} else {
		setTimeout(loadMainScripts, 50);
	}
})();
