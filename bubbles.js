/*global setInterval, Sfx*/
/*
 *  Any copyright is dedicated to the Public Domain.
 *  http://creativecommons.org/publicdomain/zero/1.0/
 */
var bubbles = 0;
var MAX_BUBBLES = 50;
var interval = -1;

function randInt(low, high) {
  return Math.round(Math.random() * (high - low)) + low;
}

function removeBubble(b) {
  document.body.removeChild(b);
  bubbles--;
}

function spawnBubble() {
  var b = document.createElement('div');
  b.className = 'bubble';
  b.style.left = (Math.random() * (window.innerWidth - 100) - 100) + 'px';
  b.style.animationDuration = (Math.random() * 4 + 2) + 's';
  click(b, function(e) {
    e.stopPropagation();
    Sfx.play(Sfx.pop);
    removeBubble(b);
  });
  b.addEventListener('animationend', function() {
    removeBubble(b);
  }, false);
  document.body.appendChild(b);
  bubbles++;
}

function addBubbles() {
  if (!document.hidden && bubbles < MAX_BUBBLES) {
    var c = Math.min(4, Math.round((MAX_BUBBLES - bubbles)/2 * Math.random()));
    for (var i = 0; i < c; i++) {
      spawnBubble();
    }
  }
}

function click(thing, callback) {
  thing.addEventListener(window.ontouchstart ? 'touchstart' : 'mousedown', callback);
}

function fullscreen(thing) {
  (thing.requestFullScreen || thing.mozRequestFullScreen ||
  thing.webkitRequestFullScreen || function(x) {}).call(thing);
}

window.addEventListener('DOMContentLoaded', function() {
  click(document.documentElement, function() {
    fullscreen(document.body);
  });
  interval = setInterval(addBubbles, 1000);
});
