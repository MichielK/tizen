(function() {
	window.addEventListener("tizenhwkey", function(ev) {
		var page = document.getElementById("main");
		if (page !== null) {
			try {
				tizen.application.getCurrentApplication().exit();
			} catch (ignore) {
			}
		} else {
			window.history.back();
		}
	});
}());

(function(tau) {
	var page = document.getElementById("main");
	var selector = document.getElementById("selector");
	var selectorComponent, clickBound;

	page.addEventListener("pagebeforehide", function() {
		selector.removeEventListener("click", clickBound, false);
		selectorComponent.destroy();
	});
	
	var xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == xmlhttp.DONE) {
			refreshData(JSON.parse(this.responseText));

			// maak cirkel-selector
			clickBound = onClick.bind(null);
			selectorComponent = tau.widget.Selector(selector);
			selector.addEventListener("click", clickBound, false);
		}
	};

	var url = baseUrl + '/get-sensors';
	xmlhttp.open("GET", url);
	xmlhttp.send();

}(window.tau));

function refreshData(json) {
	var listData = json.response.switches;
	var anker = document.getElementById("selector");
	var result = '';
	for (var i = 0; i < listData.length; i++) {
		var dataElement = listData[i];
		if (dataElement.type === 'somfy') {
			continue;
		}

		var naam = dataElement.name;
		var lowercaseNaam = naam.toLowerCase();
		var id = dataElement.id;
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
		} else {
			console.log("Kon geen icoontje bepalen: " + naam);
		}

		if (status === 'on') {
			html = html + '-icon yellow" data-title="';
		} else {
			html = html + '-icon" data-title="';
		}

		html = html + naam + '" data-id="' + id + '"></div>';

		result = result + html;
	}
	anker.innerHTML = result;
}

function onClick(event) {
	var target = event.target;

	// controle of juiste element "aangeraakt" is
	if (!target.classList.contains("ui-selector-indicator")) {
		return;
	}

	target = document.getElementsByClassName("ui-item-active")[0];

	var url = baseUrl + '/sw/' + target.getAttribute("data-id") + '/';

	if (target.classList.contains('yellow')) {
		url = url + 'off';
		target.classList.remove('yellow');
		console.log(target.getAttribute("data-title") + ' uitgezet');
	} else {
		url = url + 'on';
		target.classList.add('yellow');
		console.log(target.getAttribute("data-title") + ' aangezet');
	}

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", url);
	xmlhttp.send();
}