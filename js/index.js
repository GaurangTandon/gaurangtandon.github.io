window.onload = function() {
	/**
	 * @param {String | Array} object whose last character/element has to be returned
	 */
	function lastOf(object) {
		return object[object.length - 1];
	}

	let textBlocks = ["I am a mentor", "I get things done", "I solve problems"],
		/**
		 * object to store certain variables that get reassigned
		 * values frequently
		 */
		dy = {
			get characterToInsert() {
				return dy.textToInsert[characterIndexToInsert];
			},
			get textSpan() {
				return lastOf(textSpanList);
			},
			get textToInsert() {
				return textBlocks[textIndexToInsert];
			}
		},
		typeCharacterTimeInterval = 100,
		caretToggleDisplayInterval = typeCharacterTimeInterval * 5,
		// type to untype and vice versa
		toggleWordDirectionDelay = 1000,
		textIndexToInsert = 0,
		characterIndexToInsert = 0,
		textSpanList = [document.getElementsByClassName("typedText")[0]],
		caretSpan = document.getElementsByClassName("caretSpan")[0],
		untypeTextSpan = null,
		caretSpanDisplayClass = "caretShown",
		// boolean indicating if the html tag encountered is an opening tag
		htmlTagOpened = false;

	function toggleCaretDisplay() {
		if (caretSpan.classList.contains(caretSpanDisplayClass)) {
			caretSpan.classList.remove(caretSpanDisplayClass);
		} else {
			caretSpan.classList.add(caretSpanDisplayClass);
		}
	}

	function jumpHTMLTagForward() {
		var tagName = "",
			newElement;

		if (htmlTagOpened) {
			while (/[a-z]/i.test(dy.characterToInsert)) {
				tagName += dy.characterToInsert;
				++characterIndexToInsert;
			}
			++characterIndexToInsert;

			newElement = document.createElement(tagName);

			dy.textSpan.appendChild(newElement);
			textSpanList.push(newElement);
		} else {
			textSpanList.pop();

			while (dy.characterToInsert !== ">") {
				++characterIndexToInsert;
			}
			++characterIndexToInsert;
		}
	}

	function typeCharacter() {
		if (characterIndexToInsert >= dy.textToInsert.length) {
			untypeTextSpan = dy.textSpan;
			setTimeout(unTypeCharacter, toggleWordDirectionDelay);
			return;
		}

		// opening or closing html tag
		if (dy.characterToInsert === "<") {
			characterIndexToInsert++;

			htmlTagOpened = dy.textToInsert[characterIndexToInsert] !== "/";
			if (!htmlTagOpened) characterIndexToInsert++;

			jumpHTMLTagForward();
			typeCharacter();
			return;
		}

		if (characterIndexToInsert < dy.textToInsert.length) {
			dy.textSpan.innerHTML += dy.characterToInsert;
			characterIndexToInsert++;
		}

		setTimeout(typeCharacter, typeCharacterTimeInterval);
	}

	/**
	 * - untypes the characters typed out by previous method
	 * - loops over the nodelist instead of the innerHTML characters
	 * - removes characters from textNodes only
	 * - loop logic:
	 * -
	 * - pick last child node of current node
	 * - if it is an element node
	 * - - repeat loop with its last node
	 * - if textnode, untype characters as long as it has text left
	 * - if textnode empty
	 * - - go to its previous sibling - if it exists - and repeat loop
	 * - - else go to parent node and repeat the check for siblings
	 * - - if parent node is equal to span.typedText, exit untyping
	 */
	function unTypeCharacter() {
		// finished untyping
		if (!untypeTextSpan) {
			setupTyping();
			return;
		}

		// encountered an element node
		// need to switch to its child nodes and start over
		if (untypeTextSpan.nodeType === 1) {
			untypeTextSpan = lastOf(untypeTextSpan.childNodes);
			unTypeCharacter();
			return;
		}

		var currTextcontent = untypeTextSpan.textContent;

		// finished untyping the current textnode
		if (currTextcontent === "") {
			if (untypeTextSpan.previousSibling !== null) {
				untypeTextSpan = untypeTextSpan.previousSibling;
				unTypeCharacter();
				return;
			}

			while (untypeTextSpan.previousSibling === null) {
				untypeTextSpan = untypeTextSpan.parentNode;

				if (untypeTextSpan === dy.textSpan) {
					setupTyping();
					return;
				}
			}

			untypeTextSpan = untypeTextSpan.previousSibling;

			unTypeCharacter();
			return;
		}

		untypeTextSpan.textContent = currTextcontent.substring(0, currTextcontent.length - 1);
		setTimeout(unTypeCharacter, typeCharacterTimeInterval);
	}

	function setupTyping() {
		// switch to another sentence
		textIndexToInsert++;

		// wrap over again if sentences finished
		if (textIndexToInsert === textBlocks.length) {
			textIndexToInsert = 0;
		}

		// begin from the first character
		characterIndexToInsert = 0;

		typeCharacter();
	}

	// kickoff!
	setInterval(toggleCaretDisplay, caretToggleDisplayInterval);
	typeCharacter();

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
};
