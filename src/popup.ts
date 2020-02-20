import * as moment from 'moment';
import * as $ from 'jquery';
import { Priority } from "./library/priority";
import { Task } from "./library/task";
import { TaskMessage } from "./library/message";

let count = 0;

$(function() {

  let pr: Priority = new Priority();
  let tasks = pr.parseText("Priorities for 2/19/20\n" +
      "High Priority\n" +
      "ETR-2251 \n" +
      "ETR-2252\n" +
      "IP-7128\n" +
      "IP-7129\n" +
      "FBC-249\n" +
      "xcel-614\n" +
      "\n" +
      "Medium \n" +
      "ETR-2254\n" +
      "ETR-2190\n" +
      "ETR-2262\n" +
      "FBC-393\n" +
      "FBC-395\n" +
      "FBC-373\n" +
      "FBC-399\n" +
      "FBC-398\n" +
      "FBC-407\n" +
      "FBC-346\n" +
      "FBC-378\n" +
      "FBC-382\n" +
      "FBC-383");

  for (const t of tasks) {
    $("#tasks").append('<li><a href="' + t.link + '">' + t.title + '</a></li>');
  }

  const queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    $('#url').text(tabs[0].url);
    $('#time').text(moment().format('YYYY-MM-DD HH:mm:ss'));
  });

  chrome.browserAction.setBadgeText({text: count.toString()});
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
