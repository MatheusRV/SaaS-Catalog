$(function () {
	// Set the command-line prompt to include the user's IP Address
	//$('.prompt').html('[' + codehelper_ip["IP"] + '@HTML5] # ');
	$('.prompt').html('[' + navigator.product + '@SaaS-CLI] # ');
	// Initialize a new terminal object
	var term = new Terminal('#input-line .cmdline', '#container output');
	term.init();
	// Update the clock every second
	setInterval(function () {
		function r(cls, deg) {
			$('.' + cls).attr('transform', 'rotate(' + deg + ' 50 50)')
		}
		var d = new Date()
		r("sec", 6 * d.getSeconds())
		r("min", 6 * d.getMinutes())
		r("hour", 30 * (d.getHours() % 12) + d.getMinutes() / 2)
	}, 1000);
});
var util = util || {};
util.toArray = function (list) {
	return Array.prototype.slice.call(list || [], 0);
};
var Terminal = Terminal || function (cmdLineContainer, outputContainer) {
	window.URL = window.URL || window.webkitURL;
	window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
	var cmdLine_ = document.querySelector(cmdLineContainer);
	var output_ = document.querySelector(outputContainer);
	const CMDS_ = ['login', 'cat', 'clear', 'clock', 'date', 'echo', 'help', 'uname', 'whoami'];
	var fs_ = null;
	var cwd_ = null;
	var history_ = [];
	var histpos_ = 0;
	var histtemp_ = 0;
	window.addEventListener('click', function (e) {
		cmdLine_.focus();
	}, false);
	cmdLine_.addEventListener('click', inputTextClick_, false);
	cmdLine_.addEventListener('keydown', historyHandler_, false);
	cmdLine_.addEventListener('keydown', processNewCommand_, false);
	//
	function inputTextClick_(e) {
		this.value = this.value;
	}
	//
	function historyHandler_(e) {
		if (history_.length) {
			if (e.keyCode == 38 || e.keyCode == 40) {
				if (history_[histpos_]) {
					history_[histpos_] = this.value;
				} else {
					histtemp_ = this.value;
				}
			}
			if (e.keyCode == 38) { // up
				histpos_--;
				if (histpos_ < 0) {
					histpos_ = 0;
				}
			} else if (e.keyCode == 40) { // down
				histpos_++;
				if (histpos_ > history_.length) {
					histpos_ = history_.length;
				}
			}
			if (e.keyCode == 38 || e.keyCode == 40) {
				this.value = history_[histpos_] ? history_[histpos_] : histtemp_;
				this.value = this.value; // Sets cursor to end of input.
			}
		}
	}
	//
	function processNewCommand_(e) {
		if (e.keyCode == 9) { // tab
			e.preventDefault();
			// Implement tab suggest.
		} else if (e.keyCode == 13) { // enter
			// Save shell history.
			if (this.value) {
				history_[history_.length] = this.value;
				histpos_ = history_.length;
			}
			// Duplicate current input and append to output section.
			var line = this.parentNode.parentNode.cloneNode(true);
			line.removeAttribute('id')
			line.classList.add('line');
			var input = line.querySelector('input.cmdline');
			input.autofocus = false;
			input.readOnly = true;
			output_.appendChild(line);
			if (this.value && this.value.trim()) {
				var args = this.value.split(' ').filter(function (val, i) {
					return val;
				});
				var cmd = args[0].toLowerCase();
				args = args.splice(1); // Remove cmd from arg list.
			}
			switch (cmd) {
			case 'cat':
				var url = args.join(' ');
				if (!url) {
					output('Usage: ' + cmd + ' https://raw.githubusercontent.com/...');
					output('Example: ' + cmd + ' https://raw.githubusercontent.com/templeman/awesome-ipsum/master/README.md');
					break;
				}
				$.get(url, function (data) {
					var encodedStr = data.replace(/[\u00A0-\u9999<>\&]/gim, function (i) {
						return '&#' + i.charCodeAt(0) + ';';
					});
					output('<pre>' + encodedStr + '</pre>');
				});
				break;
			case 'clear':
				output_.innerHTML = '';
				this.value = '';
				return;
			case 'clock':
				var appendDiv = jQuery($('.clock-container')[0].outerHTML);
				appendDiv.attr('style', 'display:inline-block');
				output_.appendChild(appendDiv[0]);
				break;
            case 'read':
                var appendDiv3 = jQuery($('.read-container')[0].outerHTML);
                appendDiv2.attr('style', 'display:inline-block');
                output_.appendChild(appendDiv3[0]);
                break;
            case 'create':
                var appendDiv4 = jQuery($('.create-container')[0].outerHTML);
                appendDiv2.attr('style', 'display:inline-block');
                output_.appendChild(appendDiv4[0]);
                break;
			case 'date':
				output(new Date());
				break;
			case 'echo':
				output(args.join(' '));
				break;
			case 'help':
				output('<div class="ls-files">' + CMDS_.join('<br>') + '</div>');
				break;
			case 'uname':
				output(navigator.appVersion);
				break;
			case 'whoami':
				var result = "<img src=\"" + codehelper_ip["Flag"] + "\"><br><br>";
				for (var prop in codehelper_ip) result += prop + ": " + codehelper_ip[prop] + "<br>";
				output(result);
				break;
			case 'exit':
				window.history.back();
				break;
			default:
				if (cmd) {
					output(cmd + ': comando não encontrado');
				}
			};
			window.scrollTo(0, getDocHeight_());
			this.value = ''; // Clear/setup line for next input.
		}
	}
	//
	function formatColumns_(entries) {
		var maxName = entries[0].name;
		util.toArray(entries).forEach(function (entry, i) {
			if (entry.name.length > maxName.length) {
				maxName = entry.name;
			}
		});
		var height = entries.length <= 3 ? 'height: ' + (entries.length * 15) + 'px;' : '';
		// 12px monospace font yields ~7px screen width.
		var colWidth = maxName.length * 7;
		return ['<div class="ls-files" style="-webkit-column-width:',
			colWidth, 'px;', height, '">'
		];
	}
	//
	function output(html) {
		output_.insertAdjacentHTML('beforeEnd', '<p>' + html + '</p>');
	}
	// Cross-browser impl to get document's height.
	function getDocHeight_() {
		var d = document;
		return Math.max(Math.max(d.body.scrollHeight, d.documentElement.scrollHeight), Math.max(d.body.offsetHeight, d.documentElement.offsetHeight), Math.max(d.body.clientHeight, d.documentElement.clientHeight));
	}
	//
	return {
		init: function () {
			output('<img align="left" src="img/terminal.png" width="128" height="128" style="padding: 0 10px 20px 0"><h2 style="letter-spacing: 4px">SaaS Backend CLI</h2><p>' + new Date() + '</p><p>Digite "help" para mais informações.</p>');
		},
		output: output
	}
};

$('.tabgroup > div').hide();
$('.tabgroup > div:first-of-type').show();
$('.tabs a').click(function(e){
    e.preventDefault();
    var $this = $(this),
        tabgroup = '#'+$this.parents('.tabs').data('tabgroup'),
        others = $this.closest('li').siblings().children('a'),
        target = $this.attr('href');
    others.removeClass('active');
    $this.addClass('active');
    $(tabgroup).children('div').hide();
    $(target).show();

})

