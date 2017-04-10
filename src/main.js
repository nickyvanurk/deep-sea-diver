var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

if (h > w)
	showDeviceRotationImage(w, h);

var game = new Phaser.Game(w, h, Phaser.AUTO, 'container'), main = function () {};

game.scale_factor = w / 640;
game.difficulty = 2;
game.best_score = 0;
game.score = 0;

main.prototype = {
	preload: function () {
		game.load.image('background', 'assets/img/menu/background.jpg');
		game.load.image('loading_bar', 'assets/img/menu/loading_bar.png');
		game.load.script('utils', 'lib/utils.js');
		game.load.script('splash', 'states/splash.js');

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.forceLandscape = true;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();
	},
	create: function () {
		game.state.add('splash', splash);
		game.state.start('splash');

		game.stage.smoothed = false;
	}
};

game.state.add('main', main);
game.state.start('main');

function showDeviceRotationImage(w, h) {
	var device_rotation_image = document.querySelector("#container img");

	var ratio_image = w / 288 > h / 446 ? w / 288 : h / 446;

	device_rotation_image.width = 288 * ratio_image;
	device_rotation_image.height = 466 * ratio_image;

	device_rotation_image.style.left = w / 2 - 288 * ratio_image / 2 + "px";
	device_rotation_image.style.top = h / 2 - 446 * ratio_image / 2 + "px";

	device_rotation_image.style.display = "block";
};

function hideDeviceRotationImage() {
	var device_rotation_image = document.querySelector("#container img");
	device_rotation_image.style.display = "none";
};

$(window).resize(function() {
	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

	game.scale_factor = w / 640;
	game.scale.setGameSize(w, h);
	game.state.restart();

	if (h > w)
		showDeviceRotationImage(w, h);
	else
		hideDeviceRotationImage();
});
