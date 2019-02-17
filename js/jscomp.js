(function() {
	var LS_KEY = "skilldata",
		LIKE_LS_KEY = "likecount";
	if (!JSON.parse(localStorage.getItem(LS_KEY))) localStorage.setItem(LS_KEY, "[]");
	if (!localStorage.getItem(LIKE_LS_KEY)) localStorage.setItem(LIKE_LS_KEY, "0");

	function updateTable() {
		var data = JSON.parse(localStorage.getItem(LS_KEY)),
			table = document.querySelector(".skill-table-container table tbody");

		table.innerHTML = "";

		data.forEach(function(entry) {
			var tr = document.createElement("tr");
			entry.forEach(function(val) {
				var td = document.createElement("td");
				td.innerHTML = val;
				tr.appendChild(td);
			});
			table.appendChild(tr);
		});
	}

	function setupSkillForm() {
		var skillFormBtn = document.querySelector(".skill-form .btn"),
			skillForm = document.querySelector("form.skill-form"),
			nameField = document.getElementById("name"),
			skillField = document.getElementById("skill"),
			profSelectMenu = document.getElementById("prof");

		skillForm.addEventListener("submit", function(e) {
			e.preventDefault();
			e.stopImmediatePropagation();
			e.stopPropagation();
			return false;
		});

		// gets called even when input validation is incorrect
		skillFormBtn.addEventListener("click", function() {
			var name = nameField.value,
				skill = skillField.value,
				selectedOption = profSelectMenu.selectedOptions[0].value;
			if (!name || !skill || !selectedOption) return;

			var data = JSON.parse(localStorage.getItem(LS_KEY));
			data.push([name, skill, selectedOption]);
			localStorage.setItem(LS_KEY, JSON.stringify(data));
			updateTable();
		});

		updateTable();
	}

	function updateCounter() {
		document.querySelector(".likecounter .count").innerHTML = +localStorage.getItem(LIKE_LS_KEY);
	}

	var emojiTimeout;
	function updateEmoji(change) {
		var map = {
				"-1": "1f622",
				"1": "1f60a",
				"5": "1f60d"
			},
			emoji = map[change],
			hiddenClass = "hidden",
			delay = 1000;
		var emojiElms = document.querySelectorAll(".emoji");
		if (emojiTimeout) clearTimeout(emojiTimeout);
		emojiTimeout = setTimeout(() => {
			emojiElms.forEach(elm => elm.classList.add(hiddenClass));
		}, delay);
		emojiElms.forEach(function(elm) {
			elm.innerHTML = `&#x${emoji};`;
			elm.classList.remove(hiddenClass);
		});
	}

	function curriedChange(change) {
		return function() {
			var curr = +localStorage.getItem(LIKE_LS_KEY);
			localStorage.setItem(LIKE_LS_KEY, curr + change);
			updateCounter();
			updateEmoji(change);
		};
	}

	function setupLikeForm() {
		var hateBtn = document.querySelector(".likebuttons .btn-danger"),
			likeBtn = document.querySelector(".likebuttons .btn-primary"),
			loveBtn = document.querySelector(".likebuttons .btn-success");

		hateBtn.addEventListener("click", curriedChange(-1));
		likeBtn.addEventListener("click", curriedChange(1));
		loveBtn.addEventListener("click", curriedChange(5));
		updateCounter();
	}

	function setupImageShow() {
		var imgContainer = document.querySelector(".img-container"),
			imgElm = imgContainer.firstElementChild,
			path = "../imgs/cats";

		imgElm.src = `${path}/0.jpg`;
		imgElm.addEventListener("click", function() {
			var curr = +this.src.match(/\d+/)[0],
				next = (curr + 1) % 5;
			this.src = `${path}/${next}.jpg`;
		});
	}

	function onload() {
		setupSkillForm();
		setupLikeForm();
		setupImageShow();
	}
	(function checker() {
		if (document.readyState == "complete") {
			onload();
		} else setTimeout(onload, 50);
	})();
})();
