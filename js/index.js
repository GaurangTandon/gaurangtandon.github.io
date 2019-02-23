(function() {
	window.onload = function() {
		var landingElm = document.getElementById("landing"),
			fadeBg = landingElm.querySelector(".fadeBg");
		function adjustLandingOpacity() {
			var downScroll = window.scrollY,
				totalWindowHeight = document.body.clientHeight,
				fraction = downScroll / totalWindowHeight,
				growth = fraction / 2,
				boxShadowRule = `rgba(0, 0, 0, ${growth}) 2px 2px 100px 1000px inset`;

			fadeBg.style["box-shadow"] = boxShadowRule;
		}

		window.addEventListener("scroll", adjustLandingOpacity);
		window.addEventListener("resize", adjustLandingOpacity);
		adjustLandingOpacity();
	};
})();
