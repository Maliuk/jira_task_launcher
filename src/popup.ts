import * as moment from 'moment';
import * as $ from 'jquery';
import { Priority } from "./library/priority";
import { Task } from "./library/task";
import { Message, MessageInterface } from "./library/message";

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

  chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    console.log(msg, sender);
  });
});

function setTasks(tasks) {

    $('#text').hide();

    for (const t of tasks) {
        $("#tasks").append('<li id="' + t._title + '"><a href="' + t._link + '">' + t._title + '</a> <span class="task-status"><img class="spl-loading" src="./loading.gif" alt="loader" height="8px" width="8px" /></span></li>');

        if (t.status) {
            let status = t.status;
            $('.task-status', $('#' + t._title)).text(status).addClass(status.toLowerCase().replace(/ /g, '-'));
        }
        else {
            $.get( t._link, function( data ) {
                let status = $('#status-val span', data).text();
                if ($('.people-details dt[title="Original Developer"]', data).length > 0 && status.indexOf("Open") > -1) {
                    status = "Reopened";
                }

                $('.task-status', $('#' + t._title)).text(status).addClass(status.toLowerCase().replace(/ /g, '-'));

                chrome.runtime.sendMessage(new Message("setTaskStatus", {title: t._title, status: status}));

            }).fail(function() {
                $('.task-status', $('#' + t._title)).text("Error").addClass("error");
                chrome.runtime.sendMessage(new Message("setTaskStatus", {title: t._title, status: "Error"}));
            });
        }
    }

    $('#tasks li').click(function (e) {
        e.preventDefault();
        let link = $('a', this).attr('href');
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            let tab = tabs[0];
            chrome.tabs.update(tab.id, {url: link});
        });
    });

    chrome.browserAction.setBadgeText({text: tasks.length.toString()});

    $('#b-new-tasks').removeClass('hidden');
    $('#b-run').addClass('hidden');
    $('#tasks').show();
}