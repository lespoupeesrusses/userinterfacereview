/*global chrome, navigator, MediaRecorder, Blob */

var uir = {};
uir.capturing = false;
uir.player = null;
uir.stream = null;
uir.recorder = null;
uir.blob = null;
uir.data = null;
uir.request = {
    endpoint: 'https://www.userinterface.review/extension',
    // endpoint: 'http://localhost:3000/extension',
    page: {
        title: null,
        url: null,
        description: null
    },
    keywords: null,
    data: null
}

uir.extractPageDescription = function () {
    var description = document.querySelector("meta[name='description']").getAttribute("content");
    return description;
}
uir.extractPageData = function () {
    chrome.tabs.query({ active: true }, function (tabs) {
        uir.tab = tabs[0];
        uir.request.page.title = uir.tab.title;
        uir.request.page.url = uir.tab.url;
        chrome.tabs.executeScript({
            code: '(' + uir.extractPageDescription + ')();'
            }, function(results) {
                console.log(results);
                uir.request.page.description = results[0];
                uir.sendRequest();
            });
    });
}
uir.sendRequest = function () {
    var xhr = new XMLHttpRequest();
    var url = uir.request.endpoint;
    url += '?title=' + encodeURIComponent(uir.request.page.title);
    url += '&url=' + encodeURIComponent(uir.request.page.url);
    url += '&description=' + encodeURIComponent(uir.request.page.description);
    url += '&keywords=' + encodeURIComponent(uir.request.keywords);
    xhr.open('POST', url);
    xhr.send(uir.request.data);
}

uir.send = function (data) {
    "use strict";
    uir.request.data = data;
    uir.extractPageData();
};

uir.record = function (stream) {
    "use strict";
    this.stream = stream;
    this.data = [];
    this.recorder = new MediaRecorder(this.stream);
    this.recorder.ondataavailable = function (event) {
        uir.data.push(event.data);
    };
    this.recorder.onstop = function (event) {
        uir.blob = new Blob(uir.data, {type: "video/webm"});
        uir.send(uir.blob);
    };
    this.recorder.start();
};

uir.stop = function () {
    "use strict";
    this.recorder.stop();
    this.capturing = false;
    var i, tracks, track;
    tracks = this.stream.getTracks();
    for (i = 0; i < tracks.length; i += 1) {
        track = tracks[i];
        track.stop();
    }
    this.stream = null;
};

uir.captureVideo = function() {
    "use strict";
    this.capturing = true;
    chrome.tabCapture.getMediaStreamId(function (streamId) {
        navigator.mediaDevices === undefined ? {} : navigator.mediaDevices;
        if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = function (constraints) {
                var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                if (!getUserMedia) {
                    return Promise.reject(new Error('getUserMedia n\'est pas implémenté sur votre navigateur'));
                }
                return new Promise(function (resolve, reject) {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });
            }
        }
        navigator.mediaDevices.getUserMedia({
            audio: {
                mandatory: {
                    chromeMediaSource: 'tab',
                    chromeMediaSourceId: streamId
                }
            },
            video: {
                mandatory: {
                    chromeMediaSource: 'tab',
                    chromeMediaSourceId: streamId
                }
            }
        })
        .then(function (stream) {
            uir.record(stream);
        })
        .catch(function (err) {
            console.log(err);
        });
    });
};

uir.captureImage = function () {
    "use strict";
    chrome.tabs.captureVisibleTab({format: 'png'}, function (screenshotUrl) {
        uir.send(screenshotUrl);
    });
};
