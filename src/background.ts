import {PriorityInterface} from "./library/priority";
import {Message, MessageInterface} from "./library/message";
import {Task} from "./library/task";
import * as factory from "./library/factory";

/* App class Singleton */
class App {
    private static instance: App;
    private factory: factory.TaskFactory = new factory.TaskFactory();
    private priority: PriorityInterface;
    private text: string;

    private constructor() {}

    public static getInstance(): App {
        if (!App.instance) {
            App.instance = new App();
        }
        return App.instance;
    }

    public run() {
        this.priority = this.factory.create(factory.flag.PRIORITY);

        chrome.runtime.onMessage.addListener((msg: MessageInterface, sender, sendResponse) => {
            let response = this[msg.action + "Message"](msg, sender, sendResponse);
            sendResponse(response);
        });

        // TODO: test listener on popup opened/closed
        chrome.runtime.onConnect.addListener(port => {
            console.log("popup opened");
            port.onDisconnect.addListener(() => {
                console.log("popup closed");
            });
        });

        /*chrome.storage.sync.set({priority: this.priority}, () => {
            console.log(this.priority);
        });*/

        /*chrome.storage.sync.get(['priority'], result => {
            console.log(result.priority);
        });*/
    }

    /* Messages */
    private getTasksMessage(msg: MessageInterface, sender, sendResponse): MessageInterface {
        return new Message("", this.priority.getTasks());
    }

    private setTasksMessage(msg: MessageInterface, sender, sendResponse): MessageInterface {
        this.priority.clear();

        this.text = msg.body;
        let found = this.text.match(/[A-Za-z]+-[0-9]+/gmi);

        for (const f of found) {
            this.priority.addTask(f.toString());
        }

        return new Message("", this.priority.getTasks());
    }

    private addTaskMessage(msg: MessageInterface, sender, sendResponse): MessageInterface {
        return new Message("", this.priority.addTask(msg.body));
    }

    private clearTasksMessage(msg: MessageInterface, sender, sendResponse): MessageInterface {
        return new Message("", this.priority.clear());
    }

    private updateTaskStatusMessage(msg: MessageInterface, sender, sendResponse): MessageInterface {
        let status = this.priority.updateTaskStatus(msg.body.title).then((status) => {
            chrome.runtime.sendMessage(new Message("taskStatusUpdated", {title: msg.body.title, status: status}));
        });
        return new Message("");
    }

    private updateTasksMessage(msg: MessageInterface, sender, sendResponse): MessageInterface {
        this.priority.removeStatuses();
        return new Message("", this.priority.getTasks());
    }

    private addToMineTasksMessage(msg: MessageInterface, sender, sendResponse): MessageInterface {
        return new Message("", this.priority.addToMine(msg.body.title, msg.body.isMine));
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

/*
(<any>chrome).app.runtime.onLaunched.addListener(function() {
    (<any>chrome).app.window.create('public/index.html', {
        innerBounds: {
            width: 800,
            height: 600,
            minWidth: 200,
            minHeight: 200,
        }
    });
});
*/