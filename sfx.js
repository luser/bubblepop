/*
 *  Any copyright is dedicated to the Public Domain.
 *  http://creativecommons.org/publicdomain/zero/1.0/
 */
function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          console.error('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      }
    );
  };

  request.onerror = function() {
    console.error('BufferLoader: XHR error');
  };

  request.send();
};

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
};


var Sfx = {};

Sfx.ready = false;

Sfx.audioInit = function()
{
    if (window.AudioContext) {
        Sfx.ac = new AudioContext();
    } else if (window.webkitAudioContext) {
        Sfx.ac = new webkitAudioContext();
    } else {
        console.log("Sorry, no Web Audio API in this browser.");
        return;
    }

    var urls = [
      'pop.mp3'
    ];
    function finishedLoading(res)
    {
        // bleh
        Sfx.pop = res[0];
        Sfx.ready = true;
    }
    var bufferLoader = new BufferLoader(Sfx.ac, urls, finishedLoading);
    bufferLoader.load();
};

Sfx.play = function(buffer, loop) {
    if (!Sfx.ready) return {stop: function(){}};
    var source = Sfx.ac.createBufferSource();
    source.loop = !!loop;
    source.buffer = buffer;
    source.connect(Sfx.ac.destination);
    if (source.start) {
      source.start(0);
    } else if (source.noteOn) {
      source.noteOn(0);
    }
    return {stop: function() { source.stop(0); }};
};

Sfx.audioInit();
