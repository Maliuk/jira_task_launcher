import * as moment from 'moment';
import * as $ from 'jquery';
import { Priority } from "./library/priority";
import { Task } from "./library/task";
import { Message, MessageInterface } from "./library/message";

let port = chrome.runtime.connect();
let count = 0;

$(function() {

    $('#tasks').hide();

    let tasks = [];

    chrome.runtime.sendMessage(new Message("getTasks"), function (msg: MessageInterface) {
        tasks = msg.body;

        if (tasks.length > 0) {
            setTasks(tasks);
        }
    });


    $('#b-run, #b-update').click(function (e) {
        e.preventDefault();

        $('#tasks').hide().html('');

        let text = $('#text').val();

        chrome.runtime.sendMessage(new Message($(this).attr("id") == "b-run" ? "setTasks" : "updateTasks", text), function (msg: MessageInterface) {
          tasks = msg.body;

          if (tasks.length > 0) {
              setTasks(tasks);
          }
        });

        chrome.storage.sync.set({priority: tasks}, () => {
          //console.log(this.priority);
        });
    });

    $('#b-new-tasks').click(function (e) {
        e.preventDefault();

        chrome.runtime.sendMessage(new Message("clearTasks"));

        $('#text').show();
        $('#tasks').hide().html('');
        $('#b-new-tasks').addClass('hidden');
        $('#b-run').removeClass('hidden');
    });

    $("#b-add").click(function (e) {
        e.preventDefault();
        let taskName = prompt("Enter task name", "");

        if (taskName) {
            chrome.runtime.sendMessage(new Message("addTask", taskName), function (msg: MessageInterface) {
                if (!msg.body) {
                    alert("Enter valid task name");
                }
                else {
                    window.location.reload();
                }
            });
        }
    });

    const queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
        $('#url').text(tabs[0].url);
        $('#time').text(moment().format('YYYY-MM-DD HH:mm:ss'));
    });

    chrome.browserAction.setBadgeText({text: tasks.length.toString()});
    //chrome.browserAction.setBadgeText({text: count.toString()});
    $('#countUp').click(()=>{
        chrome.browserAction.setBadgeText({text: (++count).toString()});
    });

    $('#changeBackground').click(()=>{
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            color: '#555555'
          },
          function(msg) {
            console.log("result message:", msg);
          });
        });
    });
});

chrome.runtime.onMessage.addListener((msg: MessageInterface, sender, sendResponse) => {
    if (msg.action == "taskStatusUpdated") {
        setTaskStatus(msg.body.title, msg.body.status);
    }
});

function setTaskStatus(title: string, status: string) {
    $('.task-status', $('#' + title)).text(status).addClass(status.toLowerCase().replace(/ /g, '-'));
}

function setTasks(tasks) {

    $('#text').hide();

    for (const t of tasks) {
        $("#tasks").append('<li id="' + t._title + '"><input type="checkbox" name="' + t._title + '" ' + (t.isMine ? "checked" : "") + ' /><a href="' + t._link + '">' + t._title + '</a> <span class="task-status"><img class="spl-loading" src="./loading.gif" alt="loader" height="8px" width="8px" /></span></li>');

        if (t.status) {
            setTaskStatus(t._title, t.status);
        }
        else {
            chrome.runtime.sendMessage(new Message("updateTaskStatus", {title: t._title}));
        }
    }

    $('#tasks li a').click(function (e) {
        e.preventDefault();
        let link = $(this).attr('href');
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            let tab = tabs[0];
            chrome.tabs.update(tab.id, {url: link});
        });
    });

    $('#tasks li input[type="checkbox"]').on("change", function () {
        chrome.runtime.sendMessage(new Message("addToMineTasks", {
            title: $(this).parents("li").attr("id"),
            isMine: $(this).is(":checked")
        }));
    });

    chrome.browserAction.setBadgeText({text: tasks.length.toString()});

    $('#b-new-tasks').removeClass('hidden');
    $('#b-run').addClass('hidden');
    $('#tasks').show();
}