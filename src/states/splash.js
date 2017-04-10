var splash = function () {}, music;

splash.prototype = {
	loadScripts: function () {
		game.load.script('webfont', 'vendor/webfontloader.js');

		game.load.script('menu', 'states/menu.js');
		game.load.script('howto', 'states/howto.js');
		game.load.script('highscore', 'states/highscore.js');
		game.load.script('play', 'states/play.js');
		game.load.script('gameover', 'states/gameover.js');
	},
	loadAudio: function () {
		game.load.audio('life_instru', ['assets/audio/life_instru.mp3',
			'assets/audio/life_instru.ogg']);
		game.load.audio('hit', 'assets/audio/hit.wav');
		game.load.audio('collect', 'assets/audio/score.wav');
	},
	loadImages: function () {
		game.load.image('btn_play', 'assets/img/menu/btn_play.png');
		game.load.image('btn_howto', 'assets/img/menu/btn_howto.png');
		game.load.image('btn_highscore', 'assets/img/menu/btn_highscore.png');
		game.load.image('btn_back', 'assets/img/menu/btn_back.png');
		game.load.image('btn_again', 'assets/img/menu/btn_again.png');

		game.load.image('key_up', 'assets/img/menu/key_up.png');
		game.load.image('key_down', 'assets/img/menu/key_down.png');
		game.load.image('key_left', 'assets/img/menu/key_left.png');
		game.load.image('key_right', 'assets/img/menu/key_right.png');

		game.load.image('phone', 'assets/img/menu/phone.png');

		game.load.spritesheet('tileset', 'assets/img/game/tileset_32x32.png', 32, 32);
		game.load.image('player', 'assets/img/game/submarine.png');
		game.load.image('bubble', 'assets/img/game/bubble.png');
		game.load.image('collectable', 'assets/img/game/collectable.png');
		game.load.image('btn_pause', 'assets/img/game/btn_pause.png');
		game.load.image('btn_resume', 'assets/img/game/btn_resume.png');
		game.load.image('health_bar', 'assets/img/game/health_bar.png');
		game.load.image('depth_meter', 'assets/img/game/depth_meter.png');
	},
	loadFonts: function () {
		WebFontConfig = {
			custom: {
				families: ['Silkscreen'],
				urls: ['assets/style/main.css']
			}
		};
	},
	init: function () {
		var x = game.world.centerX;
		var y = game.world.centerY;

		this.background = game.make.sprite(x, y, 'background');
		this.background.scale.set(game.scale_factor);
		this.status = game.make.text(x, y - 25 * game.scale_factor, 'Loading...', {fill: 'white'});
		this.status.scale.set(game.scale_factor);
		this.loading_bar = game.make.sprite(x - (320 * game.scale_factor) / 2, y, 'loading_bar');

		utils.centerGameObjects([this.background, this.status]);
	},
	preload: function () {
		game.add.existing(this.background);
		game.add.existing(this.status);
		game.add.existing(this.loading_bar);
		this.load.setPreloadSprite(this.loading_bar);
		this.loading_bar.scale.set(game.scale_factor);

		this.loadScripts();
		this.loadAudio();
		this.loadImages();
		this.loadFonts();
	},
	addGameStates: function () {
		game.state.add('menu', menu);
		game.state.add('howto', howto);
		game.state.add('highscore', highscore);
		game.state.add('play', play);
		game.state.add('gameover', gameover);
	},
	create: function () {
		this.status.setText('Ready!');
		this.addGameStates();

		setTimeout(function () {
			game.state.start('menu');
		}, 1000);
	}
};
