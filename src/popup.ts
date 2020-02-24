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
          $("#tasks").append('<li id="' + t.title + '"><a href="' + t.link + '">' + t.title + '</a> <span class="task-status"><img class="spl-loading" src="./loading.gif" alt="loader" height="8px" width="8px" /></span></li>');

          $('#text').hide();

          $.get( t.link, function( data ) {
              let status = $('#status-val span', data).text();
              $('.task-status', $('#' + t.title)).text(status).addClass(status.toLowerCase().replace(/ /g, '-'));

              if ($('.people-details dt[title="Original Developer"]', data).length > 0 && (status.indexOf("In Dev") > -1 || status.indexOf("Open") > -1)) {
                  $('#' + t.title).append('<span class="task-reopen">reopen</span>');
              }

              /*if (data.indexOf("We couldn't connect to that issue") > -1) {
                  $('.task-status', $('#' + t.title)).text("No task").addClass("spl-error");
              }*/

          }).fail(function() {
              $('.task-status', $('#' + t.title)).text("Error").addClass("spl-error");
          });
      }

      $('#tasks li a').click(function (e) {
          e.preventDefault();
          let link = $(this).attr('href');
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
              let tab = tabs[0];
              chrome.tabs.update(tab.id, {url: link});
          });
      });

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
