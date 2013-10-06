function sendQuote() {
	$('#square').on('input', function(){
		$('#notification').removeClass().addClass('hide');
	});

	$('#password').on('input', function(){
		$('#notification').removeClass().addClass('hide');
	});


	var form = $('#submitButton');
	form.click(function(event){
		event.preventDefault();

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
}

$(document).ready(function(){
	sendQuote();
});