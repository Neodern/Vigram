/**
 * Vigram
 *
 * @author: Nicolas (@neodern) Jamet <neodern@gmail.com>
 * @about: Download pics & videos from Instagram with a single click !
 */

var tags = document.querySelectorAll('[i18n]');
for (var i = 0; i < tags.length; i++)
{
    tags[i].innerText += chrome.i18n.getMessage(tags[i].getAttribute('i18n'));
}