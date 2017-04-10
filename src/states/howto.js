var howto = function () {};

howto.prototype = {
	changeToMenuState: function () {
		game.state.start('menu');
	},
	nextHowTo: function () {
		if (this.current_how_to_state < 3)
			this.current_how_to_state++;

		this.showCorrectHowToState();
	},
	prevHowTo: function () {
		if (this.current_how_to_state > 1)
			this.current_how_to_state--;

		this.showCorrectHowToState();
	},
	hideAllHowToStates: function () {
		this.player.visible = false;
		this.key_up.visible = false;
		this.key_down.visible = false;
		this.key_left.visible = false;
		this.key_right.visible = false;
		this.phone.visible = false;

		this.tile.visible = false;
		this.collectable.visible = false;

		this.tile_txt.visible = false;
		this.collectable_txt.visible = false;
	},
	showCorrectHowToState: function () {
		this.hideAllHowToStates();

		if (this.current_how_to_state === 1) {
			this.left_arrow_txt.visible = false;

			this.player.visible = true;

			if (game.device.desktop) {
				this.key_up.visible = true;
				this.key_down.visible = true;
				this.key_left.visible = true;
				this.key_right.visible = true;
			}
			else {
				this.phone.visible = true;
			}
		}
		else if (this.current_how_to_state === 2) {
			this.left_arrow_txt.visible = true;
			this.right_arrow_txt.visible = true;

			this.tile.visible = true;
			this.tile_txt.visible = true;
		}
		else {
			this.right_arrow_txt.visible = false;

			this.collectable.visible = true;
			this.collectable_txt.visible = true;
		}
	},
	init: function () {
		var x = game.world.centerX;
		var y = game.world.centerY;

		this.current_how_to_state = 1;

		this.background = game.make.sprite(x, y, 'background');
		this.background.scale.set(game.scale_factor);
		this.btn_back = game.make.button(x, game.world.height - 20, 'btn_back', this.changeToMenuState, this);
		this.btn_back.scale.set(game.scale_factor);
		this.btn_back.anchor.set(0.5, 1);

		var style = {font: '18pt Silkscreen', fill: 'white', align: 'center'};
		this.left_arrow_txt = game.make.text(20 * game.scale_factor, y + 2 * game.scale_factor, '◄', style);
		this.left_arrow_txt.smoothed = true;
		this.left_arrow_txt.scale.set(game.scale_factor);
		this.left_arrow_txt.anchor.set(0, 0.5);
		this.left_arrow_txt.inputEnabled = true;
		var self = this;
		this.left_arrow_txt.events.onInputUp.add(function () {
			self.prevHowTo();
		});

		this.right_arrow_txt = game.make.text(game.world.width - 20 * game.scale_factor, y + 2 * game.scale_factor, '►', style);
		this.right_arrow_txt.smoothed = true;
		this.right_arrow_txt.scale.set(game.scale_factor);
		this.right_arrow_txt.anchor.set(1, 0.5);
		this.right_arrow_txt.inputEnabled = true;
		this.right_arrow_txt.events.onInputUp.add(function () {
			self.nextHowTo();
		});

		this.player = game.make.sprite(x, y, 'player');
		this.player.scale.set(1.5 * game.scale_factor);

		var key_distance = 70 * game.scale_factor;
		this.key_up = game.make.sprite(this.player.x,
			this.player.y - (key_distance - 4), 'key_up');
		this.key_down = game.make.sprite(this.player.x,
			this.player.y + (key_distance + 4), 'key_down');
		this.key_left = game.make.sprite(this.player.x - key_distance,
			this.player.y + 4, 'key_left');
		this.key_right = game.make.sprite(this.player.x + key_distance,
			this.player.y + 4, 'key_right');

		this.key_up.smoothed = true;
		this.key_down.smoothed = true;
		this.key_left.smoothed = true;
		this.key_right.smoothed = true;

		this.key_up.scale.set(0.75 * game.scale_factor);
		this.key_down.scale.set(0.75 * game.scale_factor);
		this.key_left.scale.set(0.75 * game.scale_factor);
		this.key_right.scale.set(0.75 * game.scale_factor);

		this.phone = game.make.sprite(x, y, 'phone');
		this.phone.smoothed = true;
		this.phone.scale.set(game.scale_factor);

		this.tile = game.make.sprite(x, y - 100 * game.scale_factor, 'tileset', 0);
		this.tile.scale.set(1.5 * game.scale_factor);

		style = {font: '16pt Silkscreen', fill: 'white', align: 'center'};
		this.tile_txt = game.make.text(x, y - 40 * game.scale_factor, 'Avoid hitting the walls.\nIf you hit a wall other than the\nbottom of the submarine you\'ll\nbe damaged, otherwise you\'ll\nbe destroyed.', style);
		this.tile_txt.scale.set(game.scale_factor);
		this.tile_txt.anchor.set(0.5, 0);

		this.collectable = game.make.sprite(x, y - 100 * game.scale_factor, 'collectable');
		this.collectable.scale.set(1.5 * game.scale_factor);

		this.collectable_txt = game.make.text(x, y - 40 * game.scale_factor, 'If damaged, you can collect a\ncrate to repair your submarine.\nThe downside of collecting a\ncrate is that you\'ll become\nheavier thus descending faster.', style);
		this.collectable_txt.scale.set(game.scale_factor);
		this.collectable_txt.anchor.set(0.5, 0);

		utils.centerGameObjects([
			this.background,
			this.player,
			this.key_up,
			this.key_down,
			this.key_left,
			this.key_right,
			this.phone,
			this.tile,
			this.collectable,
		]);

		this.showCorrectHowToState();

		if (game.device.desktop) {
			this.left_key = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
			this.right_key = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
			this.esc_key = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
			this.space_key = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			game.input.keyboard.addKeyCapture([
				Phaser.Keyboard.ESC,
				Phaser.Keyboard.SPACEBAR,
				Phaser.Keyboard.LEFT,
				Phaser.Keyboard.RIGHT
			]);

			this.left_key.onDown.add(function () {this.prevHowTo();}, this);
			this.right_key.onDown.add(function () {this.nextHowTo();}, this);
		}
	},
	create: function () {
		game.add.existing(this.background);

		if (game.device.desktop) {
			game.add.existing(this.key_up);
			game.add.existing(this.key_down);
			game.add.existing(this.key_left);
			game.add.existing(this.key_right);
		}
		else {
			game.add.existing(this.phone);
		}

		game.add.existing(this.player);
		game.add.existing(this.tile);
		game.add.existing(this.collectable);

		game.add.existing(this.tile_txt);
		game.add.existing(this.collectable_txt);

		game.add.existing(this.btn_back);
		game.add.existing(this.left_arrow_txt);
		game.add.existing(this.right_arrow_txt);
	},
	update: function () {
		if (game.device.desktop) {
			if (this.esc_key.isDown || this.space_key.isDown) {
				this.changeToMenuState();
			}
		}
	}
}