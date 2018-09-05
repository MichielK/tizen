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
    var page,
        list,
        listHelper;

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