$(function() {
	var $ledstrip = $('#ledstrip');
	var i = 0;
	for (i = 0; i < 25; i++) {
		var led = '<div class="led" data-index="' + i.toString() + '"></div>';
		$ledstrip.append(led);
	}
});

var Led = {
	set: function(colors) {
		$.each(colors.leds, function(index, color) {
			$('.led[data-index="' + index + '"]').css('background-color',
				'rgb(' + color.r + ',' + color.g + ',' + color.b + ')');
		});
	}
};

var socket = io.connect('http://192.168.2.10');
socket.on('updateLeds', Led.set);