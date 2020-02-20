
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.color) {
        console.log('Receive color = ' + msg.color);
        document.body.style.backgroundColor = msg.color;
        sendResponse('Change color to ' + msg.color);

        let tasks = document.getElementById('tasks');
        tasks.style.backgroundColor = msg.color;
    } else {
        sendResponse('Color message is none.');
    }
    const a = $.ajax;
});


fetch(chrome.extension.getURL('content.html'))
    .then(response => response.text())
    .then(data => {
        document.body.innerHTML += data;
        // other code
        // eg update injected elements,
        // add event listeners or logic to connect to other parts of the app

        let tasks = document.getElementById('tasks');
        tasks.onclick = function () {
            alert("clicked");
        };
    }).catch(err => {
    alert("error");
});

let links = document.querySelectorAll('a');
links.forEach(function (el) {
    el.onclick = function () {
        console.log("clicked");
    }
});
