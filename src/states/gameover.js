var gameover = function () {};

gameover.prototype = {
	changeToMenuState: function () {
		game.state.start('menu');
	},
	changeToPlayState: function () {
		game.state.start('play');
	},
	changeToHighscoreState: function () {
		game.state.start('highscore');
	},
	init: function () {
		var x = game.world.centerX;
		var y = game.world.centerY;

		this.background = game.make.sprite(x, y, 'background');
		this.background.scale.set(game.scale_factor);
		this.title_txt = game.make.text(x, y - 100 * game.scale_factor, 'Deep Sea Diver', {
			font: '36pt Silkscreen',
			fill: 'white',
			align: 'center'
		});
		this.title_txt.setShadow(3, 3, 'rgba(0, 0, 0, 0.5)', 5);
		this.title_txt.scale.set(game.scale_factor);

		this.sub_txt = game.make.text(x, (this.title_txt.y + this.title_txt.height - 10), '[Game Over]', {
			font: '18pt Silkscreen',
			fill: 'white',
			align: 'center'
		});
		this.sub_txt.setShadow(3, 3, 'rgba(0, 0, 0, 0.5)', 5);
		this.sub_txt.scale.set(game.scale_factor);

		var style = {font: '18pt Silkscreen', fill: 'white', align: 'center'};
		this.score_txt = game.make.text(x - 70 * game.scale_factor, (y + 18 * game.scale_factor) - 15 * game.scale_factor, 'Score: ' + game.score, style);
		this.score_txt.scale.set(game.scale_factor);

		var local_storage = localStorage.getItem('highscore_' + game.difficulty);
		var score = local_storage === null ? game.score : local_storage;
		this.best_txt = game.make.text(x - 70 * game.scale_factor, (y + 18 * game.scale_factor) + 15 * game.scale_factor, 'Best: ' + score, style);
		this.score_txt.anchor.set(0, 0.5);
		this.best_txt.anchor.set(0, 0.5);
		this.best_txt.scale.set(game.scale_factor);

		
		this.btn_again = game.make.button(x, y + 100 * game.scale_factor, 'btn_again', this.changeToPlayState, this);
		this.btn_again.scale.set(game.scale_factor);		

		this.btn_back = game.make.button(x - 80 * game.scale_factor, y + 100 * game.scale_factor, 'btn_back', this.changeToMenuState, this);
		this.btn_back.scale.set(game.scale_factor);		

		this.btn_highscore = game.make.button(x + 80 * game.scale_factor, y + 100 * game.scale_factor, 'btn_highscore', this.changeToHighscoreState, this);
		this.btn_highscore.scale.set(game.scale_factor);

		utils.centerGameObjects([
			this.background,
			this.title_txt,
			this.btn_again,
			this.btn_back,
			this.btn_highscore,
			this.sub_txt
		]);

		if (game.device.desktop) {
			this.space_key = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			this.esc_key = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
			game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.ESC]);
		}
	},
	create: function () {
		game.add.existing(this.background);
		game.add.existing(this.title_txt);
		game.add.existing(this.score_txt);
		game.add.existing(this.best_txt);
		game.add.existing(this.btn_again);
		game.add.existing(this.btn_back);
		game.add.existing(this.btn_highscore);
		game.add.existing(this.sub_txt);
	},
	update: function () {
		if (game.device.desktop) {
			if (this.space_key.isDown)
				this.changeToPlayState();
			else if (this.esc_key.isDown)
				this.changeToMenuState();
		}
	}
}