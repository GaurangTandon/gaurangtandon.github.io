function debounce(func, timeout) {
    return func;
}

function getTopOffset(elm) {
    return elm.getBoundingClientRect().top + window.pageYOffset;
}

function onload() {
    document.body.style.paddingRight = document.body.offsetWidth - document.body.clientWidth + "px";

    var timelineElm = document.getElementById("timeline"),
        downArrows = document.getElementsByClassName("down-arrow");

    Array.prototype.forEach.call(downArrows, function(downArrow) {
        downArrow.addEventListener("click", function() {
            var topOffset = getTopOffset(this.parentElement.nextElementSibling);

            window.scrollTo({
                top: topOffset,
                behavior: "smooth"
            });
        });
    });

    var backToTopBtn = document.getElementById("backtotop"),
        firstContainer = document.getElementsByClassName("container-fluid")[0],
        displayOffset = firstContainer.clientHeight / 2;

    function checkScrollTopBtnDisplay() {
        if (window.scrollY >= displayOffset) {
            backToTopBtn.style.display = "initial";
        } else {
            backToTopBtn.style.display = "none";
        }
    }
    window.onscroll = debounce(checkScrollTopBtnDisplay);

    checkScrollTopBtnDisplay();

    backToTopBtn.addEventListener("click", function() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

var loadInterval = setInterval(function() {
    if (document.readyState === "complete") {
        clearInterval(loadInterval);
        onload();
    }
}, 100);
