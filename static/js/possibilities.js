
function loadPossibilities() {
	$.get('/possibilities.json', function(data){
		data = JSON.parse(data);
		var table = $('<table></table>');
		var head = $('<thead></thead>');
		var tr = $('<tr></tr>');
		tr.append($('<td></td><td>Phrase</td><td>Drinking Behavior</td><td>Date Added</td>'));
		$(head).append(tr);
		$(table).append(head);
		var body = $('<tbody></tbody>');

		var num = 1;
		data.forEach(function(poss){
			tr = $('<tr></tr>');
			var td = $('<td>' + num + '</td><td>' + poss.square + '</td><td>' + poss.numDrinks + '</td><td>' + poss.dateAdded + '</td>');
			$(tr).append(td);
			$(body).append(tr);		
			num++;
		});

		var form = $('<form id="addQuote" action="/AddSquare"></form>');
		form.append($('<input name="square" type="text" id="square" placeholder="Quote"></br>'));
		form.append($('<input name = "numDrinks" type="text" id="numDrinks" placeholder="Number of Drinks"></br>'));
		var passwordField = $('<input name="password" type="password" id="password" placeholder="Password"></br>')
		form.append(passwordField);
		var button = $('<input name="submit" type="button" id="submitButton" value="Submit">') 
		form.append(button);


		$(passwordField).keypress(function(e){
			if (e.which == 13) {
				$(button).click();
			}
		});


		$(button).click(function(e){
			e.preventDefault();

			var $form = $( '#addQuote' ),
				sq = $form.find("input[name='square']" ).val(),
				pass = $form.find("input[name='password']" ).val(),
				url = $form.attr( "action" ),
				nd = $form.find("input[name='numDrinks']" ).val();

			var posting = $.post(url, {square: sq, password: pass, numDrinks: nd}, function(){
				$('#notification').removeClass().addClass('success').text('Success');
				$('#square').val('');
				$('#numDrinks').val('');
				$('#password').val('');
				loadPossibilities();
			})
			posting.fail(function(err) {

				$('#password').val('');
				$('#notification').removeClass().addClass('failure').text('Failure');
				if (err.status == 401) {
					$('#notification').removeClass().addClass('failure').text('Failure: Bad Password');
				}
			});

			return false;
		});


		$(table).append(body);
		$('#content').empty();
		$('#content').append(table).append(form).append($('<div id="notification"></div>'));
	});

}


$(document).ready(function(){
	loadPossibilities();
});
