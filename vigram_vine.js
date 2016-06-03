/**
 * Vigram
 * @version : 3.0.0
 * @author: Nicolas (@neodern) Jamet <neodern@gmail.com>
 * @about: Download pics & videos from Vine & Instagram with a single click !
 */

var image = chrome.extension.getURL("medias/images/vigram_128.png");

var VigramVine = (function() {

  function            getVigramButton(node)
  {
    var video = node.querySelector('video');
    if (!video) {
      return;
    }
    var metas = {
        url: video.getAttribute('poster')
    };
    if (!metas.url || metas.url == 'default.mp4') {
      return;
    }

    metas.name = metas.url.split('/')[4];

    var link = document.createElement('a'),
        button = document.createElement('button'),
        span = document.createElement('span'),
        caption = document.createElement('span');

    button.className = "ember-view action clear share";
    span.style.background = 'url(' + VigramLogo + ') no-repeat 50% 50%';
    span.style.backgroundSize = '20px';
    span.style.display = "block";
    span.style.height = "20px";
    span.style.width = "20px";
    link.href = metas.url;
    link.setAttribute('download', metas.name);
    caption.className = 'caption';
    caption.innerText = 'Vigram';

    link.appendChild(span);
    link.appendChild(caption);
    button.appendChild(link);

    return button;
  }

  function            isMediaBlock(node)
  {
      return !!node &&
              node.tagName == "DIV" &&
              !!node.classList &&
              !!node.classList.contains('post');
  }

  function    setButton(video)
  {
    if (video.classList.contains('Vigram')) {

      return;
    }

    var node = video;
    while (!isMediaBlock(node) && !!node) {
      node = node.parentNode;
    }
    if (!node || node.tagName != "DIV") {

      return;
    }
    var button = getVigramButton(video);
    if (!button) {

      return;
    }

    video.classList.add('Vigram');
    var commentNode = node.querySelector('.post-engagement');
    commentNode.querySelector('.post-actions.with-captions').appendChild(button);
  }


  function  init()
  {
    if (window.location.origin === "https://vine.co") {

      window.addEventListener('DOMSubtreeModified', function(e) {

          var medias = document.querySelectorAll('.post');
          // console.log(medias);
          for (var k = 0; k < medias.length; k++) {
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
