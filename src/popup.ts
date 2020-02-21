import * as moment from 'moment';
import * as $ from 'jquery';
import { Priority } from "./library/priority";
import { Task } from "./library/task";
import { TaskMessage } from "./library/message";

let count = 0;

$(function() {

  let pr: Priority = new Priority();
  let tasks = [];

  $('#b-run').click(function (e) {
      e.preventDefault();
      let text = $('#text').val();
      tasks = pr.parseText(text.toString());

      for (const t of tasks) {
        $("#tasks").append('<li><a href="' + t.link + '">' + t.title + '</a></li>');
      }

      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
              tasks: tasks
            },
            function(msg) {
              console.log("result message:", msg);
            });
      });

      chrome.browserAction.setBadgeText({text: tasks.length.toString()});
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
