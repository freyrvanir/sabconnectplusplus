# SABconnect++ Forums branch

This is a fork of the popular Chrome extension SABconnect++

## Features
* Adds NZB Search for the following Forums
  * ghost-of-usenet.org
  * usenet-4all.info
  * (more to come)
* Adds a button to each forum posting which extracts the Usenet-header from the text and performs a NZB search on nzbindex.nl
* Extracts the NZB-password from the forum topic if present
* Displays input fields for clean tile, password and category on nzbindex.nl which will be used when performing an One-Click-Import to SABnzb

## How to use
### Installation
Since this fork is not in the chrome web store (and probably never will), you need to download and extract the source code to your machine. In chrome, enable the developer mode and load the extension from the extracted folder. If you've been using SABconnect++ before, you will need to disable the original extension and setup the configuration again (hostname, API-Keys)

### Usage
Go to one of the supported forums and select a post you want to download. Most forums will require you to press a "thank you" button. After that, press the NZB-icon which is added to each posting. The extension will try to detect the Usenet-header, the clean title and the password and will open nzbindex.nl in a new window. When you import a NZB from the search results, the password and title will also be imported.

### Disclaimer
The detection of the NZB-header and passwords might not work reliably. Please check the extracted contents in the nzbindex.nl input fields.


# About SABconnect++
SABconnect++ adds one-click 'Send to SABnzbd' buttons to many popular NZB index sites.

You also get a taskbar button that allows you to keep an eye on your SABnzbd: current downloads, pause (individual downloads, or pause all), or remove individual queued downloads.

Install SABconnect++ at our [Chrome Web Store page](https://chrome.google.com/webstore/detail/okphadhbbjadcifjplhifajfacbkkbod).

## Features:

  * One-click NZB downloads for the following sites:
    * binsearch.info (binsearch.net)
    * bintube.com
    * dognzb.com
    * fanzub.com
    * nzbclub.com
    * nzbindex.com (nzbindex.nl)
    * omgwtfnzbs.org
    * yubse.com
    * animezb.com
    * animenzb.com
    * Any Newznab-based indexer
  * Context menu option for sending links to SABnzbd
  * Options page that looks consistent with Chrome's own options layout
  * Download speed graph
  * Pause individual downloads
  * Pause all downloads
  * Remove individual downloads
  * Desktop notifications (Download Complete/Failed)
  * Storage sync for settings

SABconnect++ is a fork of the now unmaintained Chrome extension [SABconnect](http://code.google.com/p/sabconnect/).


