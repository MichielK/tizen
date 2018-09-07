(function() {
	window.addEventListener("tizenhwkey", function(ev) {
		var activePopup = null, page = null, pageid = "";

		if (ev.keyName === "back") {
			activePopup = document.querySelector(".ui-popup-active");
			page = document.getElementsByClassName("ui-page-active")[0];
			pageid = page ? page.id : "";

			if (pageid === "main" && !activePopup) {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
				}
			} else {
				window.history.back();
			}
		}
	});
}());

(function(tau) {
	var page = document.getElementById("selectorPage");
	var selector = document.getElementById("selector");
	var selectorComponent, clickBound;

	function onClick(event) {
		var target = event.target;
		
		if (!target.classList.contains("ui-selector-indicator")) {
			return;
		}

		target = document.getElementsByClassName("ui-item-active")[0];
		console.log(target);
		
		console.log('Clicked title: ' + target.getAttribute("data-title"));
		console.log('Clicked id: ' + target.getAttribute("data-id"));
		return;
	}
	page.addEventListener("pagebeforeshow", function() {
		clickBound = onClick.bind(null);
		selectorComponent = tau.widget.Selector(selector);
		selector.addEventListener("click", clickBound, false);
	});
	page.addEventListener("pagebeforehide", function() {
		selector.removeEventListener("click", clickBound, false);
		selectorComponent.destroy();
	});
}(window.tau));

(function(tau) {
	var anker = document.getElementById("selector");
	var result = '';

	var listData = JSON_DATA_STATUS.response.switches;
	for (var i = 0; i < listData.length; i++) {
		var dataElement = listData[i];
		if(dataElement.type === 'somfy')
		{
			continue;
		}

		var naam = dataElement.name;
		var lowercaseNaam = naam.toLowerCase();
		
		var id = dataElement.id; // TODO
		var status = dataElement.status;

		var html = '<div class="ui-item ';
		if (lowercaseNaam.search('lamp') > -1) {
			html = html + 'lamp';
		} else if (lowercaseNaam.search('spotjes') > -1) {
			html = html + 'lamp';
		} else if (lowercaseNaam.search('switch') > -1) {
			html = html + 'switch';
		} else if (lowercaseNaam.search('stekkerdoos') > -1) {
			html = html + 'socket';
		}
		else {
			console.log("Kon geen icoontje bepalen: " + naam);
		}

		if (status === 'on') {
			html = html + '-aan-icon yellow" data-title="';
		} else {
			html = html + '-uit-icon" data-title="';
		}

		html = html + naam + '" data-id="' + id + '"></div>';

		result = result + html;
	}
	anker.innerHTML = result;

}(window.tau));