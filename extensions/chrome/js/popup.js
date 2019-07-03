/*global chrome, window, URL */

var test = function () {
    var xhr = new XMLHttpRequest();
    var url = chrome.extension.getBackgroundPage().uir.request.endpoint;
    xhr.open('GET', url, true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText)
            var user = data.user;
            document.getElementById("logged").style.display = 'block';
            document.getElementById("unlogged").style.display = 'none';
            document.getElementById("user").innerHTML = "Hi, " + user;
        }
      }
    };
    xhr.send();
}

var refreshView = function () {
    "use strict";
    if (chrome.extension.getBackgroundPage().uir.capturing) {
        document.getElementById("keywords").style.display = 'none';
        document.getElementById("videoCapture").style.display = 'none';
        document.getElementById("stop").style.display = 'block';
        document.getElementById("image").style.display = 'none';
    } else {
        document.getElementById("keywords").style.display = 'block';
        document.getElementById("videoCapture").style.display = 'block';
        document.getElementById("stop").style.display = 'none';
        document.getElementById("image").style.display = 'block';
    }
};

var setKeywords = function () {
    "use strict";
    var keywords = document.getElementById("keywords").value;
    chrome.extension.getBackgroundPage().uir.request.keywords = keywords;
}

document.getElementById("videoCapture").addEventListener('click', function () {
    "use strict";
    setKeywords();
    chrome.extension.getBackgroundPage().uir.captureVideo();
    window.close();
});

document.getElementById("stop").addEventListener('click', function () {
    "use strict";
    chrome.extension.getBackgroundPage().uir.stop();
    window.close();
});

document.getElementById("image").addEventListener('click', function () {
    "use strict";
    setKeywords();
    chrome.extension.getBackgroundPage().uir.captureImage();
    window.close();
});


window.onload = function () {
    "use strict";
    test();
    refreshView();
};
