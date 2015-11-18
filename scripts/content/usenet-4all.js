function parsePost(addLink, callback) {
	// get header and password
	var root = $(addLink).closest('.alt1');
	var title = root.find('strong').text().replace(/\./g, " ");
	if (!title) title = root.find('font[size=4]').text().replace(/\./g, " ");
	var hiddenContent = root.html().replace(/<input.+?value="/gi, "<input>").replace(/<.+?>/gi, "").replace(/[<>"]/gi, "");
	var header = /(?:Header:\s*|Subject:\s*|Header.*?:\s*)+(.+)/gim.exec(hiddenContent);
	if (header == null) {
		alert("no header found");
		return;
	}
	header = header[1].trim();
	
	var password = /(?:PW:\s*|Pass.*:\s*|Code:\s*)+(.+)/gim.exec(hiddenContent);
	if (password != null) {
		password = password[1].trim();
		if (password == "Der Autor hat diesen Text versteckt. Du musst den Beitrag liken um den Inhalt zu sehen.") password = null;
	}

	callback(addLink, title, header, password, null);
	
	return false;
}

function handleAllDownloadLinks() {
	$('.alt1 > div:last-of-type > a:last-of-type').each(function() {
	    var img = chrome.extension.getURL('/images/sab2_16.png');
	    var link = '<a class="parsePost"><img title="Send to SABnzbd" src="' + img + '" /></a>';
	    $(this).after(link);
	});

    // Change the onclick handler to send to sabnzbd
    $('.parsePost').click(function() {
		var addLink = this;
		parsePost(addLink, 
			function(addLink, title, header, password, category) {
				showNzbSearch(header, title, password, category);
		});
	});
}

function RefreshSettings() {}

Initialize( 'usenet4all', RefreshSettings, function() {
	handleAllDownloadLinks();

});