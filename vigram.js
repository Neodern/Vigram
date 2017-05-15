/**
 * Vigram
 * @version : 2.0.2
 * @author: Nicolas (@neodern) Jamet <neodern@gmail.com>
 * @about: Download pics & videos from Instagram with a single click !
 */

chrome.runtime.onInstalled.addListener(function(details) {
   if (details.reason == "install"){
       chrome.tabs.create({url: "firstRun.html"});
   }
   else if(details.reason == "update"){
       chrome.tabs.create({url: "updated.html"});
   }
});
