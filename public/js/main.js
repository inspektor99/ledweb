$(function() {
	$('#test').click(function() {
		$.ajax({
			type: 'PUT',
			contentType: 'application/json; charset=utf-8',
			url: 'setLedStrip',
			data: JSON.stringify({
				color: {
					r: 255,
					g: 100,
					b: 50
				}
			}),
			success: function() {
				console.log('yes');
			},
			dataType: 'json'
		});
		return false;
	});
});