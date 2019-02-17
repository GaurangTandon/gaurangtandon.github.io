var cssPath = "../css/",
	cssResources = ["bootstrap.min.css", "fa-solid.css", "fontawesome.css", "rrssb.css", "index.css"],
	jsPath = "../js/",
	jsResources = {
		preload: ["jqslim.min.js"],
		mainload: ["bootstrap.min.js", "rrssb.min.js", "nav.js"]
	};

cssResources.forEach(function(cssResource) {
	var link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = cssPath + cssResource;
	document.head.appendChild(link);
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
