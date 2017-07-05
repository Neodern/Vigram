/**
 * Vigram
 * @version : 2.2
 * @author: Nicolas (@neodern) Jamet <neodern@gmail.com>
 * @about: Download pics & videos from Instagram with a single click !
 */

var VigramLogo = chrome.extension.getURL("medias/images/vigram_48.png");

/**
 *
 * @param element
 * @returns {HTMLElement}
 */
function getVigramButton(element) {

    var media = element.querySelector('img');
    if (!media)
        media = element;

    if (media.tagName !== 'IMG' && media.tagName !== 'VIDEO')
        return null;

    var metas = {
        url: media.getAttribute('src')
    };
    metas.name = metas.url.split("/")[ 4 ]

    var VigramLink = document.createElement('a');
    var VigramButton = document.createElement('span');

    VigramLink.className = "VigramButton";
    VigramLink.style.background = 'url(' + VigramLogo + ') no-repeat 50% 50%';

    VigramLink.href = metas.url;
    VigramLink.setAttribute('download', metas.name);
    VigramLink.appendChild(VigramButton);

    return VigramLink;
}

function isMediaBlock(node) {
    return node.classList.contains('ResponsiveBlock') ||
        (node.classList.contains('_22yr2') && !node.parentNode.classList.contains('ResponsiveBlock'));
}

/**
 *
 * @param elem
 */
function setButton(elem) {
    if (elem.classList.contains('Vigram') && elem.offsetWidth !== 600) {
        return;
    }

    var button = getVigramButton(elem);
    if (!button) {
        return;
    }

    var node = elem;
    while (node.tagName !== 'ARTICLE') {
        node = node.parentNode;
    }

    var commentNode = node.querySelectorAll("._rgrbt")[ 0 ];
    if (!!commentNode && !commentNode.classList.contains('Vigram')) {
        commentNode.classList.add('Vigram');
        var lovelyHearth = commentNode.querySelectorAll('._soakw[class*=Heart]')[ 0 ];
        var parentNode = lovelyHearth.parentNode;
        var container = parentNode.parentNode;
        if (!!lovelyHearth && !container.classList.contains('Vigram')) {
            container.classList.add('Vigram')
            container.insertBefore(button, parentNode);
        }
    } else if (!!commentNode) {

        var root = document.getElementById('react-root'),
            isOverlay = root.hasAttribute('aria-hidden') ? root.getAttribute('aria-hidden') : false;
        if (isOverlay != 'true') {
            return;
        }

        var modalCommentNode = commentNode.children[ commentNode.children.length - 1 ];
        var oldNode = modalCommentNode.querySelectorAll('.VigramButton')[ 0 ];
        if (!oldNode) {
            return;
        }

        if (oldNode.href === button.href) {
            return;
        }

        var commentNodeRef = oldNode.parentNode;
        commentNodeRef.replaceChild(button, commentNodeRef.querySelectorAll('.VigramButton')[ 0 ]);
    } else {
        return;
    }

    elem.classList.add('Vigram');
}

/**
 *
 */
if (window.location.origin === "https://www.instagram.com") {
    window.addEventListener('DOMSubtreeModified', function (e) {

        var medias = document.querySelectorAll('._jjzlb:not(.Vigram), video:not(.Vigram)');
        for (var k = 0; k < medias.length; k++) {
            setButton(medias[ k ]);
        }
    });
}
