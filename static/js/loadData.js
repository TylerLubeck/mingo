console.log('loaded file');

function loadTable() {
	console.log('helloooooooo')
	$.get('/possibilities.json', function(data){
		data = JSON.parse(data);
		//console.log(data.length);
		//console.log(data);
		var table = $('<table></table>');
		var tr = $('<tr></tr>');
		var xPos = 1;
		var yPos = 1;
		var width = 5;
		var height = 5;

		for (i in data){

			if(xPos > width) {
				$(table).append(tr);
				tr = $('<tr></tr>');
				xPos = 0;
				yPos++;
			}
			if(yPos > height){
				break;
			}

			var td = $('<td></td>');
			//console.log(data[i].square)
			$(td).text(data[i].square);
			$(tr).append(td);




			xPos++;
		}
		console.log(table);


		$('#content').append(table);
		console.log($('#content').html());
	})
}

$(document).ready(function(){
	loadTable();
})