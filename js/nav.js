(function() {
	var navInnerHTML = `
    <a class="navbar-brand" href="index.html">Gaurang</a>
    <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
    >
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item">
                <a class="nav-link" href="index.html">Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="skills.html">Skills</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="ontheinternet.html">On the Internet</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="about.html">About me</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="jscomp.html">JS Component</a>
            </li>
        </ul>
    </div>`;

	function onload() {
		var navbar = document.createElement("div"),
			screenReaderText = " <span class=\"sr-only\">(current)</span>";
		navbar.className = "navbar navbar-expand-lg fixed-top navbar-dark bg-dark";
		navbar.innerHTML = navInnerHTML;
		document.body.insertBefore(navbar, document.body.firstChild);

		var allLinks = document.querySelectorAll(".nav-item");
		for (let i = 0, link; i < allLinks.length; i++) {
			link = allLinks[i];
			if (new RegExp(link.firstElementChild.href).test(window.location.href)) {
				link.innerHTML += screenReaderText;
				link.classList.add("active");
				break;
			}
		}
	}
	(function documentReadyCheck() {
		if (document.readyState == "complete") {
			onload();
		} else setTimeout(documentReadyCheck, 50);
	})();
})();
