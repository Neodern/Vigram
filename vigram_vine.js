/**
 * Vigram
 * @version : 2.0.1
 * @author: Nicolas (@neodern) Jamet <neodern@gmail.com>
 * @about: Download pics & videos from Vine & Instagram with a single click !
 */

var image = chrome.extension.getURL("medias/images/vigram_128.png");

/**
 * AJAX call.
 * @param verb
 * @param url
 * @param cb
 */
function    ajax(verb, url, cb, index)
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(url) {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            return cb(xmlhttp.responseText, index);
    };
    if (url === null)
        url = '';
    xmlhttp.open(verb, url, true);
    xmlhttp.send();
}

/**
 * Vine - Single page. <o/
 */
function singleVine()
{
    var badges = document.querySelectorAll('.badges')[0];
    if (typeof badges !== 'undefined' && document.querySelectorAll('#VineButton').length == 0)
    {
        var vineContainer = document.querySelectorAll('.vine-video-container')[0];
        var fullUrl = vineContainer.querySelector('video').getAttribute('src');
        if (typeof fullUrl !== 'undefined')
        {
            var url = fullUrl.split('?')[0];
            var tmp = url.split('/');
            tmp = tmp[tmp.length - 1];
            var name = tmp.substring(0, tmp.indexOf('.')),
                VigramBlock = document.createElement('div'),
                VigramLink = document.createElement('a'),
                VigramButton = document.createElement('img'),
                VigramText = document.createElement('p');

            VigramBlock.className = 'share-badge';
            VigramLink.id = 'VineButton';
            VigramLink.href = url;
            VigramLink.setAttribute('download', name);
            VigramButton.src = image;
            VigramText.innerHTML = 'Vigram';

            VigramLink.appendChild(VigramButton);
            VigramLink.appendChild(VigramText);
            VigramBlock.appendChild(VigramLink);
            badges.insertBefore(VigramBlock, badges.querySelector('.twitter'));
        }
    }
}

function getChannelsVigramButton(container, url, name)
{
    var VigramLink = document.createElement('a'),
        VigramButton = document.createElement('img'),
        VigramText = document.createElement('span');

    container.className += " VineButtonChannels";
    container.id = '';
    VigramText.className = 'caption';
    VigramText.innerText = 'Vigram';
    VigramLink.className = 'VineButtonChannels';
    VigramLink.href = url;
    VigramLink.setAttribute('download', name);
    VigramButton.src = image;
    VigramLink.appendChild(VigramButton);
    VigramLink.appendChild(VigramText);
    container.appendChild(VigramLink);
    return container;

}

function getMeta(content)
{
    var pattern = '<video src="',
        start = content.indexOf(pattern, 0) + pattern.length,
        end = content.indexOf('>', start, 200) - 1,
        url = content.substring(start, end).split('?')[0],
        tmp = url.split('/'),
        name = tmp[tmp.length - 1];
    return {name:name, url:url};

}

function timelineVine(getVigramButton, classToClone, classToAppend, element)
{
    var linkSingleVine = element.querySelector('.share-overlay a');
    if (linkSingleVine && linkSingleVine.href !== null)
    {
        ajax('GET', linkSingleVine.href, function(content) {
            var vineMeta = getMeta(content),
                VigramContainer = element.nextElementSibling.querySelector(classToClone).cloneNode(false);
            element.nextElementSibling.querySelector(classToAppend).appendChild(getVigramButton(VigramContainer, vineMeta.url, vineMeta.name));
        }, null);
    }

}

function    mousemover(e) {
    e = e ? e : window.event;

    if (document.URL.split('/')[3] === 'v')
    {
        singleVine();
    }
    else if (e.target.tagName === "VIDEO")
    {
        var element = e.target.parentNode.parentNode.parentNode;
        if (hasClass(element, "video-container") && !hasClass(element, 'Vigram'))
        {
            element.className += " Vigram";
            timelineVine(getChannelsVigramButton, '.share', '.post-actions', element);
        }
    }
};

// console.log(window.location.origin)
// document.addEventListener('mousemove', mousemover);

var VigramVine = (function() {

  function            isMediaBlock(node)
  {
      return !!node &&
              !!node.classList &&
              !!node.classList.contains('card');
  }

  function    setButton(video)
  {
    if (video.classList.contains('Vigram')) {

      return;
    }

    var button = getVigramButton(video);
    if (!button) {

      return;
    }

    var node = video;
    console.log(node);
    while (!isMediaBlock(node) && !!node) {
      node = node.parentNode;
    }
    if (!node) {

      return;
    }

    console.log(node);
    var commentNode = node.querySelector('.post-engagement');
    console.log(commentNode);
    commentNode.querySelector('.post-actions.with-captions').appendChild(button);



    video.classList.add('Vigram');
  }


  function  init()
  {
    if (window.location.origin === "https://vine.co") {

      window.addEventListener('DOMSubtreeModified', function(e) {

          var medias = document.querySelectorAll('video');
          // console.log(medias);
          for (var k = 0; k < medias.length && k < 50; k++) {
              setButton(medias[k]);
          }
      });
    }
  }

  return {
    init: init
  }

})();

VigramVine.init();
