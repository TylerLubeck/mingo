function loadTable() {
	$.get('/possibilities.json', function(data){
		data = JSON.parse(data);
		var table = $('<table></table>');
		var tr = $('<tr></tr>');
		var xPos = 0;
		var yPos = 0;
		var width = 5;
		var height = 5;
		for (i in data){
			if (xPos == 2 && yPos == 2) {
				$(tr).append($('<td>Free Square</td>').addClass('clicked'));
				
				xPos++;
				continue;
			}
			if(xPos >= width) {
				$(table).append(tr);
				tr = $('<tr></tr>');
				xPos = 0;
				yPos++;
			}
			

			var td = $('<td class="square"></td>');
			$(td).text(data[i].square);
			$(td).click(function(e){
				if(!$(e.target).hasClass('clicked')){
					$(e.target).addClass('clicked');
					//socket.emit('square clicked', {clicked: $(e.target).text() });
				}

				if(checkColumn($(e.target)) || checkRow($(e.target).parent())){
					socket.emit('mingo', {name: localStorage.name});
					winner();
				}
			});
			$(tr).append(td);

			if(yPos > height){
				break;
			}

			xPos++;
		}


		$('#content').empty().hide().append(table).fadeIn(400);
	});

}

function StartGame(){
	var centeredDiv = $('#EnterName').hide();
	if(!localStorage.name){
		$(centeredDiv).show();
	} else {
		$(centeredDiv).empty().append($('<div id="loading"/>').text('Welcome ' + localStorage.name));
		$(centeredDiv).show();
		window.setTimeout(function(){
			$(centeredDiv).fadeOut(400, function(){
				loadTable();
			});
		}, 1000);
		return;
	}
	var EnterButton = $('#NameSaveButton').text('Save').click(function(e){
		var name = $('#name').val();
		//name = escape(name);
		if (name.length > 0){
			localStorage.name = name;
			$(centeredDiv).empty().append($('<div id="loading"/>').text('Welcome ' + localStorage.name));
			window.setTimeout(function(){
				$(centeredDiv).fadeOut(400, function(){
					loadTable();
				});
			}, 1000);
		}
		
	})
}

function winner(){

	$.pnotify({
		title: 'Mingo!',
		text: "Congratulations, " + $('<i/>').text(localStorage.name).html() + ", you've won! Click here to play again.",
		width: 'auto',
		hide: false,
		icon: false,
		text_escape: true,
		opacity: 1,
		type: 'success'
	}).click(function(){
		$('#content').fadeOut("slow");
		loadTable();
		$(this).fadeOut();
	});

}


function checkColumn(elem){
	colIndex = $(elem).getNonColSpanIndex();
	colIndex++;
	elements = $('table tr>td:nth-child(' + colIndex + ')');
	ElemsLen = elements.length;
	for(var i = 0; i < ElemsLen; i++){
		if(!$(elements[i]).hasClass('clicked')){
			return false;
		}
	}
	return true;
}

function checkRow(row){
	elems = $(row).children();
	ElemsLen = elems.length;
	for(var i = 0; i < ElemsLen; i++){
		if(!$(elems[i]).hasClass('clicked')){
			return false;
		}
		
	}
	return true;
}

$.pnotify.defaults.delay=2000;
$.pnotify.defaults.styling='jqueryui';

var socket = io.connect('/');
socket.on('news', function(data) {
	$.pnotify({
		text: data.info,
		animation: 'show',
		icon: 'picon picon-flag-green'
	});
});

$(document).ready(function(){
	StartGame();
})