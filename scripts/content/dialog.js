function findNZB(query, callback) {
	var request = {
		action: 'findNZB',
		query: query,
	};
	
	console.log("Searching for:");
	console.log(request);
	
	chrome.extension.sendMessage(
		request,
		function(response) { 
			callback(query, response);
		}
		);
}

function onResponseFind( response, addLink, callback)
{
	switch( response.ret ) {
	case 'error' :
		alert("Could not find the NZB");
		var img = chrome.extension.getURL('images/sab2_16_red.png');
		if ($(addLink).find('img').length > 0) {
			$(addLink).find('img').attr("src", img);
		} else {
			// Prevent updating the background image of Bootstrap buttons
			if ($(addLink).hasClass('btn') == false) { 
				$(addLink).css('background-image', 'url('+img+')');
			}
		}
		break;
	case 'success':
		// If there was an error of some type, report it to the user and abort!
		if (response.data.error) {
			alert(response.data.error);
			var img = chrome.extension.getURL('images/sab2_16_red.png');
			if ($(addLink).find('img').length > 0) {
				$(addLink).find('img').attr("src", img);
			} else {
				// Prevent updating the background image of Bootstrap buttons
				if ($(addLink).hasClass('btn') == false) { 				
					$(addLink).css('background-image', 'url('+img+')');
				}
			}
			return;
		}
		var img = chrome.extension.getURL('images/sab2_16_green.png');
		if ($(addLink).find('img').length > 0) {
			$(addLink).find('img').attr("src", img);
		} else if (addLink.nodeName && addLink.nodeName.toUpperCase() == 'INPUT' && addLink.value == 'Sent to SABnzbd!') {
			// Nothing; handled in nzbsorg.js
		} else {
			// Prevent updating the background image of Bootstrap buttons
			if ($(addLink).hasClass('btn') == false) { 
				$(addLink).css('background-image', 'url('+img+')');
			}
		}
		callback(response);
		break;
	default:
		alert("SABconnect: Oops! Something went wrong. Try again.");
	}
}

function showSearchResults(header, result) {
	if (result.ret != "success") {
		alert("error searching for nzb");
		return;
	}
	
	$("#sabconnectmodal_tablebody").empty();
	
	var results = result.data;
	
	if (results.length == 0) {
		alert("found no results for " + header);
		return;
	}
	
	var data = results[0];
	alert("title: " + data.title
		+ "\nsize: " + data.size
		+ "\nnzburl: " + data.nzburl);
	
	$("#sabconnectmodal_tablebody").append("<tr><td>"+data.title+"</td><td>"+data.size+"</td><td></td><td>"+data.nzburl+"</td></tr>");
}

function loadCategories() {
    var params = {
        action: 'get_categories'
    }
    chrome.extension.sendMessage(params, function(data) {
        for (i = 0; i < data.categories.length; i++) {
            var cat = '<option value="' + data.categories[i] + '">' + data.categories[i] + '</option>';
            $('#sabconnectmodal_category').append(cat);
        }
    });
}

function injectModalDialog() {
	// inject css
	var link = document.createElement("link");
	link.href = chrome.extension.getURL("third_party/jquery/jquery-ui.min.css");
	link.type = "text/css";
	link.rel = "stylesheet";
	document.getElementsByTagName("head")[0].appendChild(link);
	
	// inject dialog div
	$("body").append(
			'<div id="sabconnectmodal" title="Find NZB">'
		+	'<form>'
		+	'  <fieldset>'
		+	'    <label for="sabconnectmodal_header">Header</label>'
		+	'    <input type="text" name="header" id="sabconnectmodal_header" style="background: white; color: black;"/>'
		+	'    <input type="button" id="sabconnectmodal_btnsearch" value="Search"/><br/>'
		+	'    <label for="sabconnectmodal_title">Title</label>'
		+	'    <input type="text" name="title" id="sabconnectmodal_title" style="background: white; color: black;"/><br/>'
		+	'    <label for="sabconnectmodal_nzbpassword">Password</label>'
		+	'    <input type="text" name="nzbpassword" id="sabconnectmodal_nzbpassword" style="background: white; color: black;"/>'
		+	'    <label for="sabconnectmodal_category">Category</label>'
		+	'    <select name="category" id="sabconnectmodal_category" size="1"></select>'
		+	'    <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">'
		+	'  </fieldset>'
		+	'</form>'
		+	'<table id="sabconnectmodal_table" style="width: 100%">'
		+	'<thead><tr><th>Subject</th><th>Size</th><th>Group</th><th>Age</th></tr></thead>'
		+	'<tbody id="sabconnectmodal_tablebody" class="ui-widget-content ui-state-default"></tbody>'
		+	'</table>'
		+	'</div>'
	);
	
	$("#sabconnectmodal_btnsearch").click(function() {
		var header = $("#sabconnectmodal_header").val();
		findNZB(header, showSearchResults);
	});
	
	// fill category list
	loadCategories();	

	$("#sabconnectmodal_tablebody").selectable({
        // Don't allow individual table cell selection.
        filter: ":not(td)",

        // Update the initial total to 0, since nothing is selected yet.
        create: function( e, ui ) {
            //updateTotal( $() );
        },

        // When a row is selected, add the highlight class to the row and
        // update the total.
        selected: function( e, ui ) {
            $( ui.selected ).addClass( "ui-state-highlight" );
            var widget = $( this ).data( "uiSelectable" );
            //updateTotal( widget.selectees );
        },

        // When a row is unselected, remove the highlight class from the row
        // and update the total.
        unselected: function( e, ui ) {
            $( ui.unselected ).removeClass( "ui-state-highlight" );
            var widget = $( this ).data( "uiSelectable" )
            //updateTotal( widget.selectees );
        }
    });

	var dialog = $('#sabconnectmodal').dialog({
		autoOpen: false,
		height: 400,
		width: 600,
		modal: true,
		dialogClass: 'sabconnect',
		buttons: {
			"Submit": function() {
				alert("thank you");
			},
			Cancel: function() {
				dialog.dialog("close");
			}
		}
	});
	
	return dialog;
}

function showSearchDialog(dialog, addLink, title, header, password, suggestedCategory) {
	var nice_name= title + ((password) ? " {{" + password + "}}" : "");
	
	// alert("title: " + title
		// + "\nheader: " + header
		// + "\npassword: " + password
		// + "\nnice_name: " + nice_name);
	dialog.dialog("open");
	
	$('#sabconnectmodal_header').val(header);
	$('#sabconnectmodal_title').val(title);
	$('#sabconnectmodal_nzbpassword').val(password);
	
	var img = chrome.extension.getURL('images/sab2_16_fetching.png');
	$(addLink).find('img').attr("src", img);

	// do a search request and get the nzb url
	// findNZB(addLink, header, function(result) {
		// if (result.ret != "success") {
			// alert("error searching for nzb");
			// return;
		// }
		
		// var results = result.data;
		
		// if (results.length == 0) {
			// alert("found no results for " + header);
		// } else if (results.length > 1) {
			// alert("found more than 1 result for " + header);
		// } else if (results.length == 1) {
			// var data = results[0];
			// alert("title: " + data.title
				// + "\nsize: " + data.size
				// + "\nnzburl: " + data.nzburl);
			
			// addToSABnzbd(addLink, data.nzburl, "addurl", nice_name);
		// }
		
	// });	
}