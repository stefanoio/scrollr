/*!
 * scrollr
 *
 * Stefano Peloso - https://github.com/stefanoio/scrollr
 *
 * Free to use under terms of WTFPL version 2 license
 */

(function() {
	"use strict";

	var
		DURATION = 300,

		hasPopped = false,
		lastPageYOffset = pageYOffset,
		secondLastPageYOffset = pageYOffset,
		targetPageYOffset,
		speed,
		lastT,

		animate = function(t) {
			var
				newPageYOffset = Math.round(pageYOffset + (t - lastT) * speed);
			if(((speed > 0) && (newPageYOffset >= targetPageYOffset)) || ((speed < 0) && (newPageYOffset <= targetPageYOffset))) {
				lastPageYOffset = secondLastPageYOffset = pageYOffset;
				scrollTo(pageXOffset, targetPageYOffset);
				window.addEventListener("scroll", scroll, false);
			} else {
				lastT = t;
				scrollTo(pageXOffset, newPageYOffset);
				if(newPageYOffset === pageYOffset) {
					requestAnimationFrame(animate);
				}
			}
		},

		popstate = function() {
			var
				target;
			scrollTo(pageXOffset, lastPageYOffset);
			targetPageYOffset = false;
			if((location.hash === "#") || (!location.href.length && (location.href.substr(-1) === "#"))) {
				targetPageYOffset = 0;
			} else {
				target = document.getElementById(location.hash.substr(1));
				if(target) {
					targetPageYOffset = target.getBoundingClientRect().top + lastPageYOffset;
				}
			}
			if(targetPageYOffset !== false) {
				speed = (targetPageYOffset - pageYOffset) / DURATION;
				hasPopped = true;
				window.removeEventListener("scroll", scroll, false);
				requestAnimationFrame(function(t) {
					lastT = t;
					scrollTo(pageXOffset, lastPageYOffset);
					requestAnimationFrame(animate);
				});
			}
		},

		hashchange = function() { // workaround for this IE/Egde bug: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/3740423/
			if(hasPopped) {
				hasPopped = false;
			} else {
				lastPageYOffset = secondLastPageYOffset;
				popstate();
			}
		},

		scroll = function() {
			secondLastPageYOffset = lastPageYOffset;
			lastPageYOffset = pageYOffset;
		},

		init = function() {
			if("requestAnimationFrame" in window) {
				window.addEventListener("scroll", scroll, false);
				window.addEventListener("popstate", popstate, false);
				window.addEventListener("hashchange", hashchange, false);
			} else {
				console.error("scrollr: unsupported browser");
			}
		};

	init();

})();
