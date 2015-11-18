function parsePost(addLink, callback) {
	// get header and password
	var root = $(addLink).closest('section.messageContent > div');
	var title = root.find('h1').text().replace(/\./g, " ");
	var hiddenContent = root.find('.hide').text();
	var header = /(?:Header:\s*|Subject:\s*)+(.+)/gim.exec(hiddenContent);
	if (header == null) {
		alert("no header found");
		return;
	}
	header = header[1].trim();
	
	var password = /(?:PW:\s*|Pass.*:\s*|Code:\s)+(.+)/gim.exec(hiddenContent);
	if (password != null) {
		password = password[1].trim();
		if (password == "Der Autor hat diesen Text versteckt. Du musst den Beitrag liken um den Inhalt zu sehen.") password = null;
	}

	callback(addLink, title, header, password, null);
	
	return false;
}

function handleAllDownloadLinks() {
	$('footer.messageOptions ul').each(function() {
	    var img = chrome.extension.getURL('/images/sab2_16.png');
	    var link = '<li><a class="button parsePost"><img title="Parse this post and search for NZB" src="' + img + '" /></a></li> ';
	    $(this).append(link);
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

Initialize( 'ghostofusenet', RefreshSettings, function() {
	handleAllDownloadLinks();

});