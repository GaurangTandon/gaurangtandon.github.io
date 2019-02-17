var cssPath = "../css/",
	cssResources = ["bootstrap.min.css", "fa-solid.css", "fontawesome.css", "rrssb.css", "index.css"],
	jsPath = "../js/",
	jsResources = ["jqslim.min.js", "popper.min.js", "bootstrap.min.js", "rrssb.min.js", "nav.js"];

var head = document.querySelector("head");

cssResources.forEach(function(cssResource) {
	var link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = cssPath + cssResource;
	head.appendChild(link);
});

jsResources.forEach(function(jsResource) {
	var script = document.createElement("script");
	script.src = jsPath + jsResource;
	head.appendChild(script);
});
