var menu = function () {};

menu.prototype = {
	changeDifficultyText: function (difficulty_num) {
		if (difficulty_num == 1)
			this.difficulty_txt.text = 'Easy';
		else if (difficulty_num == 2)
			this.difficulty_txt.text = 'Medium';
		else if (difficulty_num == 3)
			this.difficulty_txt.text = 'Hard';
	},
	decreaseDifficulty: function () {
		if (game.difficulty > 1) {
			--game.difficulty;
			this.changeDifficultyText(game.difficulty);
		}
	},
	increaseDifficulty: function () {
		if (game.difficulty < 3) {
			++game.difficulty;
			this.changeDifficultyText(game.difficulty);
		}
	},
	changeToPlayState: function () {
		game.state.start('play');
	},
	changeToHowtoState: function () {
		game.state.start('howto');
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

		var style = {font: '18pt Silkscreen', fill: 'white', align: 'center'};

		this.difficulty_txt = game.make.text(x + 2 * game.scale_factor, y, '', style);
		this.difficulty_txt.scale.set(game.scale_factor);
		this.changeDifficultyText(game.difficulty);

		this.left_arrow_txt = game.make.text(x - 100 * game.scale_factor, y + 2 * game.scale_factor, '◄', style);
		this.left_arrow_txt.scale.set(game.scale_factor);
		this.left_arrow_txt.inputEnabled = true;
		this.left_arrow_txt.smoothed = true;
		var self = this;
		this.left_arrow_txt.events.onInputUp.add(function () {
			self.decreaseDifficulty();
		});

		this.right_arrow_txt = game.make.text(x + 100 * game.scale_factor, y + 2 * game.scale_factor, '►', style);
		this.right_arrow_txt.scale.set(game.scale_factor);
		this.right_arrow_txt.inputEnabled = true;
		this.right_arrow_txt.smoothed = true;
		this.right_arrow_txt.events.onInputUp.add(function () {
			self.increaseDifficulty();
		});

		this.btn_play = game.make.button(x, y + 100 * game.scale_factor, 'btn_play', this.changeToPlayState, this);
		this.btn_play.scale.set(game.scale_factor);
		this.btn_howto = game.make.button(x - 80 * game.scale_factor, y + 100 * game.scale_factor, 'btn_howto', this.changeToHowtoState, this);
		this.btn_howto.scale.set(game.scale_factor);
		this.btn_highscore = game.make.button(x + 80 * game.scale_factor, y + 100 * game.scale_factor, 'btn_highscore', this.changeToHighscoreState, this);
		this.btn_highscore.scale.set(game.scale_factor);

		utils.centerGameObjects([
			this.background,
			this.title_txt,
			this.difficulty_txt,
			this.left_arrow_txt,
			this.right_arrow_txt,
			this.btn_play,
			this.btn_howto,
			this.btn_highscore
		]);

		if (game.device.desktop) {
			this.left_key = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
			this.right_key = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
			this.space_key = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			game.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR]);
		}
	},
	create: function () {
		game.stage.disableVisibilityChange = true;

		game.add.existing(this.background);

		game.add.existing(this.title_txt);

		game.add.existing(this.difficulty_txt);
		game.add.existing(this.left_arrow_txt);
		game.add.existing(this.right_arrow_txt);

		game.add.existing(this.btn_play);
		game.add.existing(this.btn_howto);
		game.add.existing(this.btn_highscore);
	},
	update: function () {
		if (game.device.desktop) {
			if (this.left_key.isDown) {
				this.decreaseDifficulty();
				this.left_key.isDown = false;
			}
			else if (this.right_key.isDown){
				this.increaseDifficulty();
				this.right_key.isDown = false;
			}

			if (this.space_key.isDown)
				this.changeToPlayState();
		}
	}
};