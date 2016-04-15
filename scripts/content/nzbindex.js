var use_nice_name_nzbindex;

function getCategory(categoriesText) {
	// use category-dropdown when set, otherwise use groupname 
	var category = $('#sabconnect_category').val();
	if (category && category != "*") return category;
	
	if (categoriesText.indexOf('\n') != -1) {
		category = categoriesText.substr(0, categoriesText.indexOf('\n'));
	} else {
		category = categoriesText;
	}
	
	return category;
}

function getNiceName(subject) {
	var title = $('#sabconnect_title').val();
	if (title == "" && use_nice_name_nzbindex == '1') {
		title = subject;
	}
	
	var password = $('#sabconnect_nzbpassword').val();
	if (password) {
		title += " {{" + password + "}}";
	}
	
	return title;
}

function addToSABnzbdFromNzbindex() {
	var addLink = this;

    // Set the image to an in-progress image
    var img = chrome.extension.getURL('images/sab2_16_fetching.png');
	if ($(this).find('img').length > 0) {
	    $(this).find('img').attr("src", img);
	    var nzburl = $(this).attr('href');
		var categories = $(this).parent().parent().parent().parent().find('td')[3].innerText;
		var category = getCategory(categories);
		var nice_name = getNiceName($($(this).parent().parent().parent().parent().find('td')[1]).find('label')[0].innerText);
	    addToSABnzbd(addLink, nzburl, "addurl", nice_name, category);
	} else {
		$(this).css('background-image', 'url('+img+')');

	    //grab all checked boxes on page
		var a = document.getElementsByTagName('input');
		for (var i=0, len=a.length; i<len; ++i) {
			if (a[i].type == 'checkbox' && a[i].checked) {
				if ($(a[i]).parent().parent().find('td').length < 4) {
					continue;
				}
				var categories = $(a[i]).parent().parent().find('td')[3].innerText;
				var category = getCategory(categories);
				var nice_name = getNiceName($($(a[i]).parent().parent().find('td')[1]).find('label')[0].innerText);
				addToSABnzbd(addLink, 'https://nzbindex.com/download/' + a[i].value + '/' + escape(nice_name), "addurl", nice_name, category);
			}
		}
	}
	
	Cookies.set("sabconnect_category", $('#sabconnect_category').val());
	return false;
}

function loadCategories(callback) {
    var params = {
        action: 'get_categories'
    }
    chrome.extension.sendMessage(params, callback);
}

function handleAllDownloadLinks() {
	$('input[value="Create NZB"]').each(function() {
		// add button to send checked items to SABConnect
		var img = chrome.extension.getURL('/images/sab2_16.png');
		var link = '<input class="addSABnzbd" type="button" value="      Download selected" style="background-image: url('+img+'); background-repeat: no-repeat; background-position: 3px 1px;" />';
		$(this).after(link);
		$(this).parent().find('input[class="addSABnzbd"]').first().click(addToSABnzbdFromNzbindex);
	});
	

	$('table a[href*="nzbindex.nl\\/download\\/"]').each(function() {
	    var img = chrome.extension.getURL('/images/sab2_16.png');
	    var href = $(this).attr('href');
	    var link = '<a class="addSABnzbdOnClick" href="' + href + '"><img title="Send to SABnzbd" src="' + img + '" /></a> ';
	    $(this).before(link);
	});

	$('table a[href*="nzbindex.com\\/download\\/"]').each(function() {
	    var href = $(this).attr('href');
	    var img = chrome.extension.getURL('/images/sab2_16.png');
	    var link = '<a class="addSABnzbdOnClick" href="' + href + '"><img title="Send to SABnzbd" src="' + img + '" /></a> ';
	    $(this).before(link);
	});

    // Change the onclick handler to send to sabnzbd
    $('.addSABnzbdOnClick').click(addToSABnzbdFromNzbindex);
}

function addImportFields() {
	$('#search').append(
			'<div id="sabconnecimportfields" title="Find NZB">'
		+	'<form>'
		+	'  <fieldset style="margin: 0 auto; width: 730px;">'
		+	'    <p class="smaller">Use these values to import to SABnzb</p>'
		+	'    <label for="sabconnect_title">Title: </label>'
		+	'    <input type="text" name="title" id="sabconnect_title"/>'
		+	'    <label for="sabconnect_nzbpassword">RAR Password: </label>'
		+	'    <input type="text" name="nzbpassword" id="sabconnect_nzbpassword"/>'
		+	'    <label for="sabconnect_category">Category</label>'
		+	'    <select name="category" id="sabconnect_category" size="1"></select>'
		+	'  </fieldset>'
		+	'</form>'
		+	'</div>'
	);

	loadCategories(function(data) {
        for (i = 0; i < data.categories.length; i++) {
			var cat = data.categories[i];
            var item = $('<option value="' + data.categories[i] + '">' + data.categories[i] + '</option>');
			if (defaultImportValues && defaultImportValues.category == cat) {
				item.attr("selected", true);
			}
            $('#sabconnect_category').append(item);
        }
    });
}

var defaultImportValues = null;

function SetDefaultImportValues(request) {
	defaultImportValues = {
		title: request.title,
		password: request.password,
		category: (request.category != null) ? request.category : Cookies.get("sabconnect_category")
	};
	$(document).ready(fillImportFields);
}
function fillImportFields() {
	//alert(request.action);
	$('#sabconnect_title').val(defaultImportValues.title);
	$('#sabconnect_nzbpassword').val(defaultImportValues.password);
	$('#sabconnect_category').val(defaultImportValues.category);
}

function RefreshSettings()
{
	GetSetting( 'use_name_nzbindex', function( value ) {
		use_nice_name_nzbindex = value;
	});
}

Initialize( 'nzbindex', RefreshSettings, function() {
	handleAllDownloadLinks();
	addImportFields();
});