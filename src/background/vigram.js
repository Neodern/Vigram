/**
 * Vigram
 *
 * @author: Nicolas (@neodern) Jamet <neodern@gmail.com>
 * @about: Download pics & videos from Instagram with a single click !
 */

chrome.runtime.onInstalled.addListener(function(details) {
   if (details.reason == "install"){
       chrome.tabs.create({url: "../tpl/first_run.html"});
   }
});

chrome.runtime.onMessage.addListener(function (msg, sender) {
    // First, validate the message's structure
    if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
        // Enable the page-action for the requesting tab
        chrome.pageAction.show(sender.tab.id);
    } else if (msg.from === "content" && msg.subject === "badge") {
        chrome.browserAction.setBadgeText({text: msg.nb.toString()});
    }
});

