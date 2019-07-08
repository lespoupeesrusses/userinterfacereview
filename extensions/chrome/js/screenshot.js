/* window, global chrome, navigator, MediaRecorder, Blob */
window.uir = {
    page: {
        title: null,
        url: null,
        description: null,
        width: null,
        height: null,
        extractDescription: function () {
            var meta = document.querySelector("meta[name='description']"),
                description;
            if (meta) {
                description = meta.getAttribute("content");
            }
            return description;
        },
        analyze: function () {
            chrome.tabs.query({ active: true }, function (tabs) {
                uir.tab = tabs[0];
                uir.page.title = uir.tab.title;
                uir.page.url = uir.tab.url;
                uir.page.width = uir.tab.width;
                uir.page.height = uir.tab.height;
                chrome.tabs.executeScript({
                    code: '(' + uir.page.extractDescription + ')();'
                    }, function(results) {
                        uir.page.description = results[0];
                    });
            });
        }
    },
    request: {
        endpoint: 'https://www.userinterface.review/extension',
        // endpoint: 'http://localhost:3000/extension',
        keywords: null,
        data: null,
        send: function (data) {
            "use strict";
            uir.request.data = data;
            var xhr = new XMLHttpRequest();
            var url = uir.request.endpoint;
            url += '?title=' + encodeURIComponent(uir.page.title);
            url += '&url=' + encodeURIComponent(uir.page.url);
            url += '&description=' + encodeURIComponent(uir.page.description);
            url += '&keywords=' + encodeURIComponent(uir.request.keywords);
            xhr.open('POST', url);
            xhr.send(uir.request.data);
        }
    },
    video: {
        capturing: false,
        stream: null,
        recorder: null,
        chunks: null,
        capture: function() {
            "use strict";
            uir.page.analyze();
            uir.video.capturing = true;
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
                    // https://electronjs.org/docs/api/desktop-capturer
                    video: {
                        mandatory: {
                            chromeMediaSource: 'tab',
                            chromeMediaSourceId: streamId,
                            minWidth:  uir.page.width,
                            maxWidth:  uir.page.width,
                            minHeight: uir.page.height,
                            maxHeight: uir.page.height
                        }
                    }
                })
                .then(function (stream) {
                    uir.video.stream = stream;
                    uir.video.record();
                })
                .catch(function (error) {
                    console.log(error);
                });
            });
        },
        record: function () {
            "use strict";
            uir.video.chunks = [];
            // https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/MediaRecorder
            uir.video.recorder = new MediaRecorder(uir.video.stream, {
                videoBitsPerSecond: 20000000,
                audioBitsPerSecond: 128000,
                mimeType: 'video/webm'
            });
            uir.video.recorder.ondataavailable = function (event) {
                uir.video.chunks.push(event.data);
            };
            uir.video.recorder.onstop = function (event) {
                uir.blob = new Blob(uir.video.chunks, { type: 'video/webm' });
                uir.request.send(uir.blob);
            };
            uir.video.recorder.start();
        },
        stop: function () {
            "use strict";
            var i, tracks, track;
            uir.video.recorder.stop();
            uir.video.capturing = false;
            tracks = uir.video.stream.getTracks();
            for (i = 0; i < tracks.length; i += 1) {
                track = tracks[i];
                track.stop();
            }
            uir.video.stream = null;
        }
    },
    image: {
        capture: function () {
            "use strict";
            uir.page.analyze();
            chrome.tabs.captureVisibleTab({format: 'png'}, function (screenshotUrl) {
                uir.request.send(screenshotUrl);
            });
        }
    }
};
