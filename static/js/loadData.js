console.log('loaded file');

function loadTable() {
	//console.log('helloooooooo')
	$.get('/possibilities.json', function(data){
		data = JSON.parse(data);
		//console.log(data.length);
		//console.log(data);
		var table = $('<table></table>');
		var tr = $('<tr></tr>');
		var xPos = 0;
		var yPos = 0;
		var width = 5;
		var height = 5;
		//console.log(data.length);
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
			//console.log(data[i].square)
			$(td).text(data[i].square);
			$(td).click(function(e){
				//console.log($(e.target).text());
				
				if(!$(e.target).hasClass('clicked')){
					$(e.target).addClass('clicked');
					socket.emit('square clicked', {clicked: $(e.target).text() });
				}
				if(checkRow($(e.target).parent())){
					console.log('row is complete');
					socket.emit('mingo', {name: 'JohnnyBoy'});
				}
			});
			$(tr).append(td);

			if(yPos > height){
				break;
			}

			xPos++;
		}
		//console.log(table);


		$('#content').append(table);
		//console.log($('#content').html());
	});

}



function checkRow(row){
	elems = $(row).children();
	ElemsLen = elems.length;
	for(var i = 0; i < ElemsLen; i++){
		console.log($(elems[i]).hasClass('clicked'));
		if(!$(elems[i]).hasClass('clicked')){
			return false;
		}
		
	}
	console.log('returning true');
	return true;

}



$.pnotify.defaults.delay=500;
$.pnotify.defaults.styling='jqueryui';

var socket = io.connect('/');
socket.on('news', function(data) {
	$.pnotify({
		text: data.info,
		animation: 'show',
		icon: 'picon picon-flag-green'
	});
	console.log(data.info);
	socket.emit('my other event', {my: 'data'});
});





$(document).ready(function(){
	loadTable();
})