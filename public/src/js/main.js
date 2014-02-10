$(function() {
	$('#test').click(function() {
		Colors.update({
			color: {
				r: 255,
				g: 100,
				b: 50
			}
		});
		return false;
	});
	$('#reset').click(function() {
		Colors.update({
			color: {
				r: 0,
				g: 0,
				b: 0 
			}
		});
		return false;
	});
});

var Colors = {
	update: function(color) {
		$.ajax({
			type: 'PUT',
			contentType: 'application/json; charset=utf-8',
			url: 'setLedStrip',
			data: JSON.stringify(color),
			success: function() {
				console.log('yes');
			},
			dataType: 'json'
		});
	}
};