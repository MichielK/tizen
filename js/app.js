(function () {
	window.addEventListener("tizenhwkey", function (ev) {
		var activePopup = null,
			page = null,
			pageId = "";

		if (ev.keyName === "back") {
			activePopup = document.querySelector(".ui-popup-active");
			page = document.getElementsByClassName("ui-page-active")[0];
			pageId = page ? page.id : "";

			if (pageId === "main" && !activePopup) {
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
	refreshData();
}(window.tau));

var selectorWidget;
function refreshData(){	
	var xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == xmlhttp.DONE) {
			updateGui(JSON.parse(this.responseText));

			if(selectorWidget !== undefined)
				selectorWidget.destroy();
			
			var selector = document.getElementById("selector");
			selectorWidget = tau.widget.Selector(selector);
			selector.addEventListener("click", onClick, false);
		}
	};

	var url = baseUrl + '/get-sensors';
	xmlhttp.open("GET", url);
	xmlhttp.timeout = 3000;
	xmlhttp.send();	
}

function updateGui(json) {
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
	
	listData = json.response.thermometers;
	for (var i = 0; i < listData.length; i++) {
		var dataElement = listData[i];

		var naam = dataElement.name;
		var temp = dataElement.te;
		if (temp === undefined)
			temp = '-';

		var html = '<div class="ui-item text" data-title="';
		html = html + naam + '">'+temp+'&deg;</div>';

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
	
	var id = target.getAttribute("data-id");
	if (id === undefined || id === null){
		refreshData();
		return;
	}
	
	var url = baseUrl + '/sw/' + id + '/';

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
	xmlhttp.timeout = 2000;
	xmlhttp.send();
}