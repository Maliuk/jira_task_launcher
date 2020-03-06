import { Priority } from "./library/priority";
import { Message, MessageInterface } from "./library/message";
import { Task } from "./library/task";

/* App class Singleton */
class App {
    private static instance : App;
    private priority : Priority = new Priority();

    private constructor() {}

    public static getInstance() : App {
        if (!App.instance) {
            App.instance = new App();
        }
        return App.instance;
    }

    public run() {
        chrome.runtime.onMessage.addListener((msg: MessageInterface, sender, sendResponse) => {
            let response = this[msg.action + "Message"](msg, sender, sendResponse);
            sendResponse(response);
        });

        /*chrome.storage.sync.set({priority: this.priority}, () => {
            console.log(this.priority);
        });*/

        /*chrome.storage.sync.get(['priority'], function(result) {
            console.log(result.priority);
        });*/
    }

    /* Messages */
    private getTasksMessage(msg: MessageInterface, sender, sendResponse): MessageInterface {
        return new Message("", this.priority.getTasks());
    }

    private setTasksMessage(msg: MessageInterface, sender, sendResponse): MessageInterface {
        return new Message("", this.priority.setTasks(msg.body));
    }

    private clearTasksMessage(msg: MessageInterface, sender, sendResponse): MessageInterface {
        return new Message("", this.priority.clear());
    }

    private setTaskStatusMessage(msg: MessageInterface, sender, sendResponse): MessageInterface {
        let task: Task = this.priority.getTask(msg.body.title);
        task.status = msg.body.status;
        return new Message("");
    }

    private updateTasksMessage(msg: MessageInterface, sender, sendResponse): MessageInterface {
        return new Message("", this.priority.setTasks(this.priority.text));
    }
}

let app = App.getInstance();
app.run();



function polling() {
    console.log('polling');
    setTimeout(polling, 1000 * 30);
}

polling();

chrome.runtime.getPackageDirectoryEntry(function(root) {
    root.getFile("content.html", {}, function(fileEntry) {
        fileEntry.file(function(file) {
            var reader = new FileReader();
            reader.onloadend = function(e) {
                // contents are in this.result
                //alert(this.result);
            };
            reader.readAsText(file);
        }, function () {});
    }, function () {});
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    //console.log(msg, sender);
});