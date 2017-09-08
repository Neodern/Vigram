/**
 * Vigram
 *
 * @author: Nicolas (@neodern) Jamet <neodern@gmail.com>
 * @about: Download pics & videos from Instagram with a single click !
 */


var VigramLogo = chrome.extension.getURL("images/vigram_48.png");

var PAGE_TYPE_HP = "PAGE_TYPE_HP",
    PAGE_TYPE_PROFILE = "PAGE_TYPE_PROFILE",
    PAGE_TYPE_SINGLE = "PAGE_TYPE_SINGLE",
    PAGE_TYPE_MODAL = "PAGE_TYPE_MODAL";

var ARTICLE_TYPE_MULTI = "ARTICLE_TYPE_MULTI";
window.vigramList = [];

/**
 *
 * @param element
 * @returns {HTMLElement}
 */
function getVigramButton(element) {
    var medias = element.querySelectorAll('img,video');
    var mediaList = Array.prototype.slice.call(medias).filter(function (item) {
        return !(item.nodeName === "IMG" && item.height < 100);
    });

    if (mediaList.length !== 1) {
        return document.createElement('span');
    }

    var media = mediaList[0];
    var metas = {
        url: media.getAttribute('src')
    };

    metas.name = metas.url.split("/")[4];

    var VigramLink = document.createElement('a');
    var VigramButton = document.createElement('span');

    VigramLink.className = "VigramButton";
    VigramLink.style.background = 'url(' + VigramLogo + ') no-repeat 50% 50%';

    VigramLink.href = metas.url;
    VigramLink.setAttribute('download', metas.name);
    VigramLink.appendChild(VigramButton);

    return VigramLink;
}

/**
 * Récupère le type de la page.
 *
 * @returns {*}
 */
function getPageType() {
    var ogTitle = document.querySelectorAll("meta[property='og:title']"),
        ogType = document.querySelectorAll("meta[property='og:type']"),
        root = document.getElementById('react-root'),
        isOverlay = root.hasAttribute('aria-hidden') ? root.getAttribute('aria-hidden') : false;

    if (ogTitle.length !== 0 && ogType.length !== 0 && ogType[0].content === "profile") {
        return isOverlay ? PAGE_TYPE_MODAL : PAGE_TYPE_PROFILE;
    } else if (ogTitle.length !== 0 && ogType.length !== 0 && ogType[0].content === "instapp:photo") {
        return PAGE_TYPE_SINGLE;
    }

    return PAGE_TYPE_HP
}

/**
 * Récupère le type du média.
 *
 * @param article
 * @returns {*}
 */
function getArticleType(article) {
    var isMulti = article.querySelectorAll("*[class*=Chevron]").length !== 0;

    if (isMulti) {
        Array.prototype.slice.call(article.querySelectorAll('img,video')).forEach(function (item) {
            item.addEventListener("load", function () {
                setButton(article);
            });
        });

        return ARTICLE_TYPE_MULTI;
    }

    return null;
}

/**
 * Récupère la node qui contient les commentaires d'un article.
 *
 * @param article
 * @returns {NodeList}
 */
function getCommentNodeFromArticle(article) {
    var commentNode = article.querySelectorAll('*[role="button"]');

    commentNode = Array.prototype.slice.call(commentNode).filter(function (item) {
        return item.href !== "javascript:;";
    });

    commentNode = commentNode[0].parentNode;

    return commentNode;
}

/**
 * Place le bouton sur l'article en fonction du "coeur" qui se trouve dans l'article.
 *
 * @param article
 * @param lovelyHeart
 */
function setButton(article, lovelyHeart) {
    if (!lovelyHeart) {
        lovelyHeart = article.querySelectorAll('*[class*=Heart]')[0];
    }

    var parentNode = lovelyHeart.parentNode,
        container = parentNode.parentNode,
        button = getVigramButton(article);

    if (!!lovelyHeart) {
        var vigramModalButton = container.querySelectorAll(".VigramButton");
        if (vigramModalButton.length === 0) {
            container.insertBefore(button, parentNode);
        } else {
            vigramModalButton[0].href = button.href;
        }

        chrome.runtime.sendMessage(
            {from: 'content', subject: 'badge', nb: document.querySelectorAll(".VigramButton").length});
    }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
        var imgNodeList = document.querySelectorAll(".VigramButton");
        var hrefList = Array.prototype.slice.call(imgNodeList).map(function (image) {
            return image.href
        });

        var domInfo = {
            images: hrefList,
            total: hrefList.length
        };

        response(domInfo);
    }
});

/**
 * Permet de placer le bouton Vigram en fonction du type de page Instagram.
 *
 * @param article
 */
function vigramify(article) {
    var pageType = getPageType(),
        articleType = getArticleType(article);

    if (article.querySelectorAll(".VigramButton").length !== 0 && (pageType !== PAGE_TYPE_MODAL && articleType !== ARTICLE_TYPE_MULTI)) {
        return;
    }

    var commentNode, lovelyHeart;
    switch (pageType) {
        case PAGE_TYPE_HP:
        case PAGE_TYPE_SINGLE:
            commentNode = getCommentNodeFromArticle(article);
            lovelyHeart = commentNode.querySelectorAll('*[class*=Heart]')[0];
            setButton(article, lovelyHeart);
            break;
        case PAGE_TYPE_PROFILE:
            break;
        case PAGE_TYPE_MODAL:
            article = document.querySelectorAll("*[role='dialog'] article");
            if (article.length !== 1) {
                return;
            }
            articleType = getArticleType(article[0]);
            commentNode = getCommentNodeFromArticle(article[0]);
            lovelyHeart = commentNode.querySelectorAll('*[class*=Heart]')[0];
            setButton(article[0], lovelyHeart);
            break;
    }
}

/**
 * Evenement qui detecte les modifications du DOM, on récupère toutes les nodes "article" et on les vigramify.
 *
 */
if (window.location.origin === "https://www.instagram.com") {
    window.addEventListener('DOMSubtreeModified', function (e) {
        var medias = e.target.querySelectorAll("article");

        Array.prototype.slice.call(medias).forEach(function (item) {
            vigramify(item);
        });
    });
}
