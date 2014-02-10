var LedController = function() {
	this.leds = [];
	//black pixel template.  also used in resetting strip
	this.pixel = {
		r: 0,
		g: 0,
		b: 0
	};
};

LedController.prototype = {
	reset: function(count) {
		this.leds = [];
		var i = 0;
		for (i = 0; i < count; i++) {
			this.leds.push(this.pixel);
		}
	},
	setPixel: function(index, pixel) {
		this.leds[index] = pixel;
	}
};

//for front end
try {
	module.exports = LedController;
} catch (ex) {}