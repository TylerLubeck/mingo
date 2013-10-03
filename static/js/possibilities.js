
function loadPossibilities() {
	$.get('/possibilities.json', function(data){
		data = JSON.parse(data);
		var table = $('<table></table>');
		var head = $('<thead></thead>');
		var tr = $('<tr></tr>');
		tr.append($('<td>Phrase</td><td>DrinkingBehavior</td><td>Date Added</td>'));
		$(head).append(tr);
		$(table).append(head);
		var body = $('<tbody></tbody>');
		data.forEach(function(poss){
			tr = $('<tr></tr>');
			var td = $('<td>' + poss.square + '</td><td>' + poss.numDrinks + '</td><td>' + poss.dateAdded + '</td>');
			$(tr).append(td);
			$(body).append(tr);		
		});
		$(table).append(body);
		$('#content').append(table);
	});

}


$(document).ready(function(){
	loadPossibilities();
});