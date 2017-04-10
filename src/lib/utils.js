var utils = {
	centerGameObjects: function (objects) {
		objects.forEach(function (object) {
			object.anchor.set(0.5);
		});
	},
	getRandomNumBetween: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
};
