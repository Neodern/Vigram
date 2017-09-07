// Update the relevant fields with the new data
function setDOMInfo(info) {
    var message = document.querySelector("#message p");
    var button = document.querySelector("#download");
    if (!info || info.total === 0) {
        message.innerText = chrome.i18n.getMessage("popup_text");
        return;
    }

    button.textContent = info.total > 1 ? chrome.i18n.getMessage("download_button_plural", [info.total]) : chrome.i18n.getMessage("download_button_singular");
    button.style.display = info.total !== 0 ? "block" : "none";
    window.vigramList = info.images;

    document.querySelector("#download").addEventListener("click", function () {
        window.vigramList.forEach(function (image) {
            chrome.downloads.download({
                url: image
            });
        });
    });
}



// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', function () {
    // ...query for the active tab...
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        // ...and send a request for the DOM info...
        chrome.tabs.sendMessage(
            tabs[0].id,
            {from: 'popup', subject: 'DOMInfo'},
            // ...also specifying a callback to be called
            //    from the receiving end (content script)
            setDOMInfo);
    });
});
