/* Author: Garth Humphreys
   Url: http://garthhumphreys.com
   File: script.js
   Version: 1.2.5
   
   	PinIt for Google Plus™ is a simple Chrome plugin that allows you to
   bookmark your favourite post and add them to a sidebar. For more info
   goto, https://plus.google.com/110099175671440154323/posts/SVtdK1d1jTC?hl=en

   Copyright (C) 2012  Garth Humphreys

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/


$(document).ready(function() {
	
	var reloadTimer;
	var timeoutPins;
	var InitTimer;
	
	var deleteBtnUp = '#eee url('+chrome.extension.getURL('x.png')+') no-repeat left top';
	var deleteBtnOvr = 'transparent url('+chrome.extension.getURL('x.png')+') no-repeat left bottom';
	var pinitSidebarLink = 'transparent url('+chrome.extension.getURL('pin-ovr.png')+') no-repeat 8% 50%';
	var pinitBtnUp = 'transparent url('+chrome.extension.getURL('pin-up.png')+') no-repeat left top';
	var pinitBtnOvr = 'transparent url('+chrome.extension.getURL('pin-ovr.png')+') no-repeat left top';

	$("<style type='text/css'> span.pinit-btn:focus { outline: none; } span.pinit-btn { float: right; height: 16px; margin-right: -41px; margin-top: 10px; width: 10px; background:" + pinitBtnUp + "; display: block; } span.pinit-btn:hover { cursor: pointer; cursor: hand; background:" + pinitBtnOvr + "; } div#pinit-form-holder { position: absolute; left: 248px; top: 65px; z-index: 50; } .show-pinit-form { display: block; } .hide-pinit-form { display: none; } </style>").appendTo("head");
	$("<style type='text/css'> div#pinit-form { display: block; padding: 5px; box-shadow: 0px 0px 2px #AAA; border: 1px solid #BBB; background-color: #ddd; width: 308px; -webkit-border-radius: 5px; border-radius: 5px; } div#pinit-form span#pinit-title { font-size: 11px; text-transform: uppercase; font-weight: bold; line-height: 27px; } </style>").appendTo("head");
	$("<style type='text/css'> div#pinit-form span#pinit-input { -webkit-user-select: text; height: 29px; width: 237px; background-color: #fff; display: inline-block; margin: 0 7px 0 0; line-height: 26px; padding: 0 8px; font-size: 15px; -webkit-border-radius: 3px; border-radius: 3px; border: 1px solid #bbb; } div#pinit-form span#pinit-input:focus { outline: none; } </style>").appendTo("head");
	$("<style type='text/css'> div#pinit-form #pinit-submit-btn { display: inline-block; -webkit-user-select: none; -webkit-border-radius: 2px; -webkit-user-modify: read-write; border-radius: 2px; cursor: pointer; cursor: hand; font-size: 11px; font-weight: bold; text-align: center; height: 27px; line-height: 27px; outline: 0; padding: 0 8px; opacity: .5; border: 1px solid #29691D; color: white; text-shadow: 0 1px rgba(0, 0, 0, 0.1); background: #3D9400; } </style>").appendTo("head");
	$("<style type='text/css'> div.pinit-sidebar { } div.pinit-sidebar h4 { border-bottom: 1px solid #EBEBEB; color: #484848; font-size: 11px; font-weight: bold; margin: 35px 0 10px 0; padding-bottom: 6px; } div.pinit-sidebar ul { margin: 0; background-color: #fafafa; padding: 10px; } div.pinit-sidebar ul li { list-style-type: none; padding: 0; } </style>").appendTo("head");
	$("<style type='text/css'> div.pinit-sidebar ul li a { background:" + pinitSidebarLink + "; display: inline-block; padding-left: 30px; width: 102px; text-decoration: none; cursor: pointer; font-size: 13px; height: 26px; line-height: 26px; overflow: hidden; padding-right: 8px; text-overflow: ellipsis; white-space: nowrap; } </style>").appendTo("head");
	$("<style type='text/css'> div.pinit-sidebar ul li a:hover { background-color: #eee; } div.pinit-sidebar ul li span#deleteBtn { display: inline-block; width: 10px; height: 26px; cursor: pointer; cursor: hand; float: right; padding-right: 5px; } div.pinit-sidebar ul li:hover > span#deleteBtn { background:" + deleteBtnUp + "; } div.pinit-sidebar ul li:hover > span#deleteBtn:hover { background:" + deleteBtnOvr + "; } </style>").appendTo("head");
	
	InitTimer = window.setTimeout(loadPinIt, 2000);
	
	function init() {
		clearTimeout(timeoutPins);
		clearTimeout(InitTimer);
		
		var streamBtns = document.getElementsByTagName("body")[0].childNodes[8].childNodes[0].childNodes[0].childNodes[0].childNodes[1];
		
		//var sBtn = $(streamBtns).find('a[href="/sparks"]');
		
		$(streamBtns).click(function(event) {
			reloadTimer = window.setTimeout(reloadTimer, 2000);
		});
		
		function reloadTimer() {
			clearTimeout(reloadTimer);	
			init();
		}
		
		// G+ Seems to add a extra div after leaving the main stream page, so I had to go up 2 steps to the parent then locate the Options button for the PinIt button to work.		
		var pinLocation = document.getElementsByTagName("body")[0].childNodes[8].childNodes[0].childNodes[1];
		var HTML = "<span role=\"button\" class=\"pinit-btn\" title=\"Pin this post to the sidebar\" tabindex=\"1\" /><div id=\"pinit-form-holder\" class=\"hide-pinit-form\"><div id=\"pinit-form\"><div><span class=\"editable\" contenteditable=\"true\" autocomplete=\"off\" aria-haspopup=\"true\" id=\"pinit-input\"><span style=\"color: #aaa;\">Enter a title for this post</span></span><div role=\"button\" id=\"pinit-submit-btn\" aria-disabled=\"true\">Pin it</div></div><div id=\"help\" style=\"font-size: x-small; color: #888; padding-top: 4px; padding-left: 5px;\">28 Characters allowed</div></div>";
		
		// Not dependant on class, instead it works off of targeting G+'s span button "Options menu" attribute as a marker to place the pins in the right place.
		$(pinLocation).find('span[title="Options menu"]').parent().append(HTML);
		
		// Place PinIt sidebar as the second box in the left sidebar > the childNode number was previously '3' for the 4th position in the sidebar.
		var sidebarLocation = document.getElementsByTagName("body")[0].childNodes[8].childNodes[0].childNodes[2].childNodes[0].childNodes[1].childNodes[0];
		var sidebar = "<div class=\"pinit-sidebar\"><h4>Pinned Threads</h4><ul></ul></div>";
	
		var db = openDatabase('pinit', '1.0', 'PinIt Database', 2 * 1024 * 1024);
	
		db.transaction(function (tx) {
			tx.executeSql('SELECT * FROM PINIT', [], null,
				function(tx, error) {
					tx.executeSql('CREATE TABLE IF NOT EXISTS PINS (id INTEGER PRIMARY KEY, post_title, post_url)');
					tx.executeSql('CREATE TABLE IF NOT EXISTS PINIT (id INTEGER PRIMARY KEY, pstatus)');
					tx.executeSql('INSERT INTO PINIT (pstatus) VALUES ("1")');
					tx.executeSql('INSERT INTO PINS (post_title, post_url) VALUES ("Pin It Help?", "https://plus.google.com/110099175671440154323/posts/SVtdK1d1jTC?hl=en")');
				}
			);
	
		});
	
		function update() {
			clearTimeout(reloadTimer);
			$('.pinit-sidebar').remove();
			$(sidebar).insertBefore(sidebarLocation);
		
			db.transaction(function (tx) {
			   tx.executeSql('SELECT * FROM PINS', [], function (tx, results) {
			   var len = results.rows.length, i;
			   msg = [];
			   for (i = 0; i < len; i++){
			      var post = results.rows.item(i).post_title;
			      var url = results.rows.item(i).post_url;
			      var row = results.rows.item(i);
			      var p_id = row['id'];
			      msg[i] = ("<li><a id=\"" + p_id + "\" href=\"" + url + "\" title=\"" + post + "\">" + post + "</a><span role=\"button\" title=\"Delete Pin\" href=\"#\" id=\"deleteBtn\"></span></li>");
			   }

			   $('.pinit-sidebar ul').html(msg.join(''));
	
			   $("div.pinit-sidebar span").click(function(event){
					var post_id = $(this).parent().find('a').attr('id');
					deletePost(post_id);
				});
	
			 }, null);
			});
		}
	
		function createPost(post_title, post_url) {
			var data = [post_title, post_url]; 
		
			db.transaction(function (tx) {
				tx.executeSql('INSERT INTO PINS (post_title, post_url) VALUES (?, ?)', [data[0], data[1]]);
			});
		
			update();
		}
	
		function deletePost(post_id) {
			var data = [post_id]; 
		
			db.transaction(function (tx) {
				tx.executeSql('DELETE FROM PINS WHERE id=?', [data[0]]);
			});
		
			update();
		}
	
		var currentPin;
		var currentPostUrl;
		var pinitBtn;
		var pinFormHolder;
	
		$(".pinit-btn").click(function(event){
			pinitBtn = $(this);
			// Get url not dependant on class, instead it works off of targeting the url attribute "target=_blank" as a marker.
			currentPostUrl = "https://plus.google.com/" + $(this).parent().find('a[target="_blank"]').attr('href');
			pinFormHolder = $(this).next();
			$(pinFormHolder).toggle();
			
		});
		
		// After clicking the "Load more posts" button, reload the pins and sidebar
		$('span[title="Load more posts"]').click(function(event) {
			timeoutPins = window.setTimeout(reloadPins, 2000);
		});

		function reloadPins() {
			$('.pinit-btn').remove();
			$('.pinit-form-holder').remove();
			$('.pinit-sidebar').remove();
			
			init();
		}
	
		$('span#pinit-input').live('focus', function() {
		    var $this = $(this);
		    $this.data('before', $this.html());
		    return $this;
		}).live('blur keyup paste', function() {
		    var $this = $(this);
		    if ($this.data('before') !== $this.html()) {
		        $this.data('before', $this.html());
		        $this.trigger('change');
		    }
		    return $this;
		});
	
		$('span#pinit-input').change(function() {
			currentPin = $(this);
			var len = $(this).text();
			if (len == '') {
			} else {
				if (len.length >= 29) {
					$(this).text(len.slice(0, -1));
					$(this).css("border", "1px solid red");
				} else {
				}
			}
		});
	
		$("div#pinit-submit-btn").click(function(event){
			var len = strip($(currentPin).text());
			if (len == '') {
			} else {
			var post_title = len;
			var post_url = currentPostUrl;
			createPost(post_title, post_url);
			$(pinFormHolder).toggle();
		
		}
		});
	
		// Clean pinit input field of any formatting.
		function strip(html) {
		    var tempDiv = document.createElement("stripDIV");
		    tempDiv.innerHTML = html;
		    return tempDiv.innerText;
		}
	
		$("span#pinit-input").blur(function(){
			var t = $(this).text();
			if (t == "Enter a title for this post") {
				$(this).text('');
				$(this).next().css("opacity", "1");
				$(this).focus();
			} else {
				// do nothing
			}
		});
	
		update();
	}
	
	function loadPinIt() {	
		init();
	}
	

});