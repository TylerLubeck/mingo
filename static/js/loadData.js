console.log('loaded file');

function loadTable() {
	console.log('helloooooooo')
	$.get('/possibilities.json', function(data){
		console.log(data);
	})
}

$(document).ready(function(){
	loadTable();
})