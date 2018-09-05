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
	var page, list, listHelper;

	/* Check for a circular device */
	if (tau.support.shape.circle) {
		document.addEventListener('pagebeforeshow', function(e) {
			page = e.target;
			list = page.querySelector('.ui-listview');
			if (list) {
				/* Create SnapListView and binding rotary event using tau.helper */
				listHelper = tau.helper.SnapListStyle.create(list);
			}
		});

		document.addEventListener('pagebeforehide', function(e) {
			listHelper.destroy();
		});
	}
}(tau));

(function() {
	
	toggleFunction = function(event){
		var target = event.target;
		console.log(target.id);
		console.log('ipadres = ' + ipadres);
	};
	
	var page = document.getElementById("main"), 
		elList = document.getElementById("vlist1"), vlist;
	
	var listData = JSON_DATA.response.switches;

	page.addEventListener("pagebeforeshow", function() {
		vlist = tau.widget.VirtualListview(elList, {
			dataLength : listData.length,
			bufferSize : 40,
			scrollElement : "ui-scroller"
		});

		// Update listitem
		vlist.setListItemUpdater(function(elListItem, newIndex) {
			var data = listData[newIndex];
			
			var html = '<span class="ui-li-text-main" id="'+ data.id + '">'+ data.id + ' - ' + data.type + '</span>';
			elListItem.innerHTML = html;
			
			if(data.status === 'on')
				elListItem.classList.add("yellow");
			
			elListItem.addEventListener("click", toggleFunction, false);
			
		});
		// Draw child elements
		vlist.draw();
	});
	page.addEventListener("pagehide", function() {
		// Remove all children in the vlist
		vlist.destroy();

	});

}());