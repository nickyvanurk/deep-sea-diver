var play = function () {};

function Tilemap (world_size, tile_size) {
	this.layers = [];
	this.scroll_speed = Math.floor(60 * game.scale_factor);

	if (game.difficulty == 1)
		this.min_tunnel_size = 6;
	else if (game.difficulty == 2)
		this.min_tunnel_size = 4;
	else if (game.difficulty == 3)
		this.min_tunnel_size = 2;

	this.prev_left_wall = {
		size: 0,
		rand_num: 0
	};

	this.prev_right_wall = {
		size: 0,
		rand_num: 0
	};

	this.left_wall = {
		size: 1,
		rand_num: 0
	};

	this.right_wall = {
		size: 1,
		rand_num: 0
	};

	this.data_row = undefined;
	this.next_data_row = undefined;

	this.step_size = {
		min: 1,
		max: 4
	};

	this.should_spawn_row = false;
	this.ssr = false;
	this.last_tile;

	this.getLeftWall = function () {
		return this.left_wall;
	};

	this.getRightWall = function () {
		return this.right_wall;
	};

	this.getPrevLeftWall = function () {
		return this.prev_left_wall;
	};

	this.getPrevRightWall = function () {
		return this.prev_right_wall;
	};

	this.getShouldSpawnRow = function () {
		return this.ssr;
	};

	this.resetShouldSpawnRow = function () {
		this.ssr = false;
	};

	this.getLastTile = function () {
		return this.last_tile;
	};

	this.addLayer = function (name, alpha) {
		if (alpha == undefined)
			alpha = 1;

		var layer = game.add.group();
		layer.name = name;
		layer.alpha = alpha;
		this.layers.push(layer);
	};

	this.setMinimumTunnelSize = function (min_tunnel_size) {
		this.min_tunnel_size = min_tunnel_size;
	};

	this.setScrollSpeed = function (pixels_per_second) {
		this.scroll_speed = pixels_per_second;
	};

	this.getScrollSpeed = function () {
		return this.scroll_speed;
	};

	this.generateWallFromPrevious = function (prev_wall) {
		do {
			var rand_num = utils.getRandomNumBetween(this.step_size.min, this.step_size.max);
		} while (Math.abs(rand_num) == Math.abs(prev_wall.rand_num));

		// randomyly increment/decrement
		var odds = prev_wall.size == 1 ? true : Math.random() < 0.5;
		rand_num = odds ? rand_num : -Math.abs(rand_num);

		return {size: prev_wall.size + rand_num, rand_num: rand_num};
	};

	this.generateRowDataFromPrevious = function () {
		this.prev_left_wall = this.left_wall;
		this.prev_right_wall = this.right_wall;

		this.left_wall = this.generateWallFromPrevious(this.prev_left_wall);
		this.right_wall = this.generateWallFromPrevious(this.prev_right_wall);

		// correct the out of bound tiles
		if (this.left_wall.size < 1)
			this.left_wall.size = 1;

		if (this.right_wall.size > world_size.x - this.left_wall.size - this.min_tunnel_size)
			this.right_wall.size = world_size.x - this.left_wall.size - this.min_tunnel_size;

		if (this.right_wall.size < 1)
			this.right_wall.size = 1;

		if (this.left_wall.size > world_size.x - this.right_wall.size - this.min_tunnel_size)
			this.left_wall.size = world_size.x - this.right_wall.size - this.min_tunnel_size;

		// make sure there is always a tunnel_sizex2 tile gap
		var prev_prev_left = {size: this.prev_left_wall.size - this.prev_left_wall.rand_num};
		var prev_prev_right = {size: this.prev_right_wall.size - this.prev_right_wall.rand_num};

		// correct the left wall
		if (this.isWallGapSmallerThanMinTunnelSize(this.left_wall, prev_prev_right))
			this.correctWallSize(this.left_wall, prev_prev_right);
		if (this.isWallGapSmallerThanMinTunnelSize(this.left_wall, this.prev_right_wall))
			this.correctWallSize(this.left_wall, this.prev_right_wall);

		// correct the right wall
		if (this.isWallGapSmallerThanMinTunnelSize(this.right_wall, prev_prev_left))
			this.correctWallSize(this.right_wall, prev_prev_left);
		if (this.isWallGapSmallerThanMinTunnelSize(this.right_wall, this.prev_left_wall))
			this.correctWallSize(this.right_wall, this.prev_left_wall);

		// make sure there are no walls with the same size
		if (this.isWallSizeSameAsPrev(this.left_wall, this.prev_left_wall))
			this.randomWallDecrement(this.left_wall);
		if (this.isWallSizeSameAsPrev(this.right_wall, this.prev_right_wall))
			this.randomWallDecrement(this.right_wall);

		// make rand num accurate again after possible wall corrections
		this.left_wall.rand_num = this.left_wall.size - this.prev_left_wall.size;
		this.right_wall.rand_num = this.right_wall.size - this.prev_right_wall.size;
	};

	this.isWallGapSmallerThanMinTunnelSize = function (wall1, wall2) {
		var gap = world_size.x - wall1.size - wall2.size;
		return gap < this.min_tunnel_size;
	};

	this.correctWallSize = function (wall, prev_wall) {
		var new_width = world_size.x - prev_wall.size - this.min_tunnel_size;
		wall.size = new_width < 1 ? 1 : new_width;
	};

	this.isWallSizeSameAsPrev = function (wall, prev_wall) {
		return wall.size === prev_wall.size;
	};

	this.randomWallDecrement = function (wall) {
		var rand_num = utils.getRandomNumBetween(this.step_size.min, this.step_size.max);
		var new_size = wall.size - rand_num;

		wall.size = new_size < 1 ? 1 : new_size;
	};

	this.init = function () {
		this.addLayer('background', 0.3);
		this.addLayer('middleground', 0.8);
		this.addLayer('foreground');

		// populate all the layers
		var i, j, x, y;
		var prev_left = prev_right = 0;
		for (i = 0; i < world_size.y; ++i) {
			for (j = 0; j < world_size.x; ++j) {
				x = j * tile_size.x;
				y = i * tile_size.y;

				var bg_tile = game.make.sprite(x, y, 'tileset', 0);
				bg_tile.width = tile_size.x;
				bg_tile.height = tile_size.y;
				if (Math.random() < 0.1)
					bg_tile.alpha = 0.6;

				var tile = game.make.sprite(x, y + (world_size.y * tile_size.y), 'tileset', 0);
				tile.width = tile_size.x;
				tile.height = tile_size.y;
				game.physics.arcade.enable(tile);
				tile.body.immovable = true;
				tile.body.moves = false;
				if (j >= this.left_wall.size && j < world_size.x - this.right_wall.size) {
					tile.kill();
					tile.body.enable = false;
				}

				this.layers[0].add(game.add.existing(bg_tile));
				this.layers[1].add(game.add.existing(tile));
				//this.layers[2].add(game.add.sprite(x, y, 'tileset', 1));
			}

		 	prev_left = this.left_wall;
			prev_right = this.right_wall;

			this.generateRowDataFromPrevious();
		}
	};

	this.init();

	this.getCollisionLayer = function () {
		return this.layers[1];
	};

	this.scrollMapVertically = function () {
		var self = this;
		this.layers.forEach(function (layer) {
			var i, j;
			for (i = 0; i < world_size.y; ++i) {

				if (layer.name == 'middleground') {
					var first_tile_in_row = layer.children[i * world_size.x];
					if (first_tile_in_row.y + tile_size.y <= 0) {
						self.should_spawn_row = true;
						self.ssr = true;
					}
				}

				for (j = 0; j < world_size.x; ++j) {
					var tile = layer.children[j + i * world_size.x];

					if (!tile) // can be removed if all layers are full
						continue;

					if (self.should_spawn_row) {
						tile.body.y = tile.y; // to fix a weird bug were the body does not match the sprite.

						if (j >= self.left_wall.size && j < world_size.x - self.right_wall.size) {
							tile.kill();
							tile.body.enable = false;
						}
						else if (!tile.alive) {
							tile.revive();
							tile.body.enable = true;
						}
					}

					if (tile.y + tile_size.y <= 0)
						tile.y += world_size.y * tile_size.y;

					tile.y -= self.scroll_speed / 60;
				}

				if (self.should_spawn_row) {
					self.last_tile = layer.children[i * world_size.x];
					self.generateRowDataFromPrevious();
					self.should_spawn_row = false;
				}
			}
		});
	};

	this.render = function () {
		this.layers[1].forEach(function (tile) {
			if (tile.body.enable)
				game.debug.body(tile);
		});
	};
};

function Player(x, y, tile_size) {
	this.x = x;
	this.y = y;
	this.tile_size = tile_size;

	this.player_accel_speed = Math.floor(200 * game.scale_factor);
	this.player_max_speed = Math.floor(80 * game.scale_factor);
	this.player_drag = Math.floor(150 * game.scale_factor);

	this.lives = 3;

	this.player = game.make.sprite(x, y - 50 * game.scale_factor , 'player');
	this.player.scale.set(game.scale_factor);
	this.player.anchor.setTo(0.5);
	game.physics.arcade.enable(this.player);
	this.player.body.setSize(24, 24);
	this.player.body.offset.y = 4;
	this.player.body.bounce.setTo(1, 0);
	this.player.body.collideWorldBounds = true;
	this.player.body.drag.set(this.player_drag);
	this.player.body.maxVelocity.set(this.player_max_speed);
	game.add.existing(this.player);

	this.emitter = game.add.emitter(x, y, 50);
	this.emitter.width = this.tile_size.x * 1.5;
	this.emitter.makeParticles('bubble');

	this.emitter.minParticleScale = game.scale_factor;
	this.emitter.maxParticleScale = game.scale_factor;

	this.emitter.minParticleSpeed.set(0, -90 * game.scale_factor);
  this.emitter.maxParticleSpeed.set(0, -110 * game.scale_factor);

	this.emitter.setRotation(0, 0);
	this.emitter.setAlpha(0.4, 0.9);
	this.emitter.gravity = 0;

	game.physics.arcade.enable(this.emitter);
	this.emitter.enableBody = true;

	this.emitter.start(false, 5000, 100);

	this.emitter_paused = false;

	this.move_up = false;
	this.move_down = false;
	this.move_left = false;
	this.move_right = false;

	if (game.device.desktop)
		this.cursors = game.input.keyboard.createCursorKeys();

	this.getEmitter = function () {
		return this.emitter;
	};

	this.pauseEmitter = function () {
		this.emitter_paused = true;
		this.emitter.setAll('body.moves', false);
		this.emitter.on = false;
	};

	this.resumeEmitter = function () {
		this.emitter_paused = false;

		this.emitter.setAll('body.moves', true);
		this.emitter.on = true;
	};

	this.stop = function () {
		this.player.body.acceleration.set(0);
		this.player.body.velocity.set(0);
	};

	this.rotateLeft = function () {
		if (this.player.angle > -30)
			this.player.angle -= this.player.angle > 0 ? 2 : 1;
	};

	this.rotateRight = function () {
		if (this.player.angle < 30)
			this.player.angle += this.player.angle < 0 ? 2 : 1;
	};

	this.resetRotation = function () {
		if (this.player.angle)
			this.player.angle += this.player.angle < 0 ? 1 : -1;
	};

	this.getSprite = function () {
		return this.player;
	};

	this.decrementLife = function () {
		this.lives--;
	};

	this.incrementLife = function () {
		this.lives++;
	};

	this.getLives = function () {
		return this.lives;
	};

	this.isDead = function () {
		return this.lives <= 0;
	};

	this.getVelocity = function () {
		return {x: this.player.body.velocity.x, y: this.player.body.velocity.y};
	};

	this.update = function () {
		if (game.device.desktop) {
			this.move_up = this.cursors.up.isDown;
			this.move_down = this.cursors.down.isDown;
			this.move_left = this.cursors.left.isDown;
			this.move_right = this.cursors.right.isDown;
		}
		else {
			// tablet touch controls, dont forget two fingers!
			var p1 = game.input.pointer1;
			var p2 = game.input.pointer2;

			var screen_half_x = game.world.width / 2;
			var screen_third_y = game.world.height / 3;

			this.move_up = false;
			this.move_down = false;
			this.move_left = false;
			this.move_right = false;

			if (p1.isDown) {
				if (p1.y < screen_third_y)
					this.move_up = true;
				if (p1.y > game.world.height - screen_third_y)
					this.move_down = true;
				if (p1.y > screen_third_y && p1.y < game.world.height - screen_third_y) {
					if (p1.x < screen_half_x)
						this.move_left = true;
					else
						this.move_right = true;
				}
			}

			if (p2.isDown) {
				if (p2.y < screen_third_y)
					this.move_up = true;
				if (p2.y > game.world.height - screen_third_y)
					this.move_down = true;
				if (p2.y > screen_third_y && p2.y < game.world.height - screen_third_y) {
					if (p2.x < screen_half_x)
						this.move_left = true;
					else
						this.move_right = true;
				}
			}
		}

		if (this.move_up)
			this.player.body.acceleration.y = -this.player_accel_speed;
		if (this.move_down)
			this.player.body.acceleration.y = this.player_accel_speed;
		if (this.move_left) {
			this.player.body.acceleration.x = -this.player_accel_speed;
			this.rotateLeft();
		}
		if (this.move_right) {
			this.player.body.acceleration.x = this.player_accel_speed;
			this.rotateRight();
		}

		if (!this.move_up && !this.move_down)
			this.player.body.acceleration.y = 0;
		if (!this.move_left && !this.move_right) {
			this.player.body.acceleration.x = 0;
			this.resetRotation();
		}

		if (this.emitter_paused)
			this.resumeEmitter();

		this.emitter.x = this.player.x;
		this.emitter.y = this.player.y + this.player.height / 2;

		if (this.player.body.velocity.y < 0)
			this.emitter.on = false;
		else if (!this.emitter.on)
			this.emitter.on = true;
	};

	this.render = function () {
		game.debug.body(this.player);
	}
};

play.prototype = {
	init: function () {
		this.is_paused = false;
		game.score = 0;
		this.score_timer = new Date();
		this.timer = new Date();

		this.collectables = [];
		this.collectable_timer = 12;

		this.tile_size = {
			x: Math.ceil(32 * game.scale_factor),
			y: Math.ceil(32 * game.scale_factor)
		};

		this.world_size = {
			x: Math.ceil(this.game.world.width / this.tile_size.x),
			y: Math.ceil(this.game.world.height / this.tile_size.y) + 2
		};

		var x = game.world.centerX;
		var y = game.world.centerY;

		game.stage.backgroundColor = '#7A9EAD';

		game.physics.startSystem(Phaser.Physics.ARCADE);

		this.level = new Tilemap(this.world_size, this.tile_size);
		this.player = new Player(x, y, this.tile_size);

		this.health_bar_gfx = game.make.sprite(game.world.width - 10 * game.scale_factor, 10 * game.scale_factor, 'health_bar');
		this.health_bar_gfx.scale.set(game.scale_factor);
		this.depth_meter_gfx = game.make.sprite(game.world.width - 10 * game.scale_factor,
			this.health_bar_gfx.y + this.health_bar_gfx.height + (10 * game.scale_factor), 'depth_meter'); // TODO: Make it bigger to fit the score
		this.depth_meter_gfx.scale.set(game.scale_factor);
		this.health_bar_gfx.anchor.set(1, 0);
		this.depth_meter_gfx.anchor.set(1, 0);

		this.health_bar_size = 148;
		this.bitmap = game.make.bitmapData(this.health_bar_size, 10 * game.scale_factor);
		this.health_bar = game.make.sprite(this.health_bar_gfx.x - 6 * game.scale_factor, this.health_bar_gfx.y + 6 * game.scale_factor, this.bitmap);
		this.health_bar.anchor.set(1, 0);
		this.health_bar.scale.set(game.scale_factor);

		this.depth_txt = game.make.text(x, this.depth_meter_gfx.y + 5 * game.scale_factor, game.score, {
			font: '11pt Silkscreen',
			fill: 'white',
			align: 'center'
		});
		this.depth_txt.scale.set(game.scale_factor);
		this.depth_txt.x = this.depth_meter_gfx.x - this.depth_txt.width - 8 * game.scale_factor;

		this.show_new_highscore = false;
		this.new_highscore_txt = game.make.text(x, y - 50 * game.scale_factor, 'New High Score!', {
			font: '24pt Silkscreen',
			fill: 'white',
			align: 'center'
		});
		this.new_highscore_txt.scale.set(game.scale_factor);
		this.new_highscore_txt.visible = false;

		this.black_overlay = game.make.graphics(0, 0);
		this.black_overlay.beginFill(0x000000, 1);
		this.black_overlay.drawRect(0, 0,
			this.game.world.width,
			this.game.world.height);
		this.black_overlay.endFill();
		this.black_overlay.alpha = 0.6;

		this.pause_txt = game.make.text(x, y - 50 * game.scale_factor, 'PAUSED', {
			font: '36pt Silkscreen',
			fill: 'white',
			align: 'center'
		});
		this.pause_txt.scale.set(game.scale_factor);
		this.pause_txt.setShadow(3, 3, 'rgba(0, 0, 0, 0.5)', 5);
		this.btn_back = game.make.button(x, y + 50, 'btn_back', this.resume, this);
		this.btn_back.scale.set(game.scale_factor);

		this.btn_pause = game.make.button(10, 10, 'btn_pause', this.pause, this);
		this.btn_resume = game.make.button(10, 10, 'btn_resume', this.resume, this);
		this.btn_pause.scale.set(game.scale_factor);
		this.btn_resume.scale.set(game.scale_factor);

		utils.centerGameObjects([
			this.pause_txt,
			this.btn_back,
			this.new_highscore_txt
		]);

		if (game.device.desktop) {
			this.esc_key = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
			this.p_key = game.input.keyboard.addKey(Phaser.Keyboard.P);
			game.input.keyboard.addKeyCapture([
				Phaser.Keyboard.ESC,
				Phaser.Keyboard.P
			]);

			var self = this;
			this.p_key.onDown.add(function () {
				self.is_paused = !self.is_paused;

				if (self.is_paused)
					self.pause();
				else if (!self.is_paused)
					self.resume();
			}, this);
		}
	},
	getScoreCountTimerAsMillisconds: function () {
		return Math.floor(new Date() - this.score_timer);
	},
	resetScoreCountTimer: function () {
		this.score_timer = new Date();
	},
	getTimerAsSeconds: function () {
		return Math.floor((new Date() - this.timer) / 1000);
	},
	resetTimer: function () {
		this.timer = new Date();
	},
	resume: function () {
		if (this.is_paused)
			this.is_paused = !this.is_paused;

		this.black_overlay.visible = false;
		this.pause_txt.visible = false;
		this.btn_back.visible = false;

		this.btn_resume.visible = false;
	},
	pause: function () {
		if (!this.is_paused)
			this.is_paused = !this.is_paused;

		this.black_overlay.visible = true;
		this.pause_txt.visible = true;
		this.btn_back.visible = true;

		this.btn_resume.visible = true;

		this.player.stop();
	},
	updateHealthBar: function () {
		this.health_bar_size = (148 / 3) * this.player.getLives();

		this.bitmap.context.clearRect(0, 0, this.bitmap.width, this.bitmap.height);

		if (this.health_bar_size <= (148 / 3) * 1)
			this.bitmap.context.fillStyle = '#f00';   
		else if (this.health_bar_size <= (148 / 3) * 2)
			this.bitmap.context.fillStyle = '#ff0';
		else
			this.bitmap.context.fillStyle = '#0f0';

		this.bitmap.context.fillRect(0, 0, this.health_bar_size, 10);

		this.bitmap.dirty = true;
	},
	updateScore: function () {
		var interval = Math.abs(1 / ((this.level.getScrollSpeed() + this.player.getVelocity().y) / this.tile_size.y) * 1000);
		if (this.getScoreCountTimerAsMillisconds() > interval) {
			if (this.level.getScrollSpeed() + this.player.getVelocity().y > 0)
				game.score++;
			else if (this.level.getScrollSpeed() + this.player.getVelocity().y < 0 && game.score)
				game.score--;

			this.depth_txt.text = game.score;
			this.depth_txt.x = this.depth_meter_gfx.x - this.depth_txt.width - 8 * game.scale_factor;

			this.resetScoreCountTimer();
		}
	},
	create: function () {
		game.add.existing(this.health_bar_gfx);
		game.add.existing(this.depth_meter_gfx);
		game.add.existing(this.depth_txt);

		game.add.existing(this.health_bar);

		game.add.existing(this.new_highscore_txt);

		game.add.existing(this.black_overlay);
		game.add.existing(this.pause_txt);
		game.add.existing(this.btn_back);

		game.add.existing(this.btn_pause);
		game.add.existing(this.btn_resume);

		this.resume();

		this.sfx = {
			hit: game.add.audio('hit'),
			collect: game.add.audio('collect')
		};
	},
	gameOver: function () {
		if (localStorage.getItem('highscore_' + game.difficulty) === null)
			localStorage.setItem('highscore_' + game.difficulty, game.score);
		else if (game.score > localStorage.getItem('highscore_' + game.difficulty))
			localStorage.setItem('highscore_' + game.difficulty, game.score);

		game.state.start('gameover');
	},
	moveCollectables: function (speed) {
		var self = this;
		this.collectables.forEach(function (collectable) {
			collectable.y -= speed;

			if (collectable.y + self.tile_size.y < 0)
				collectable.destroy();
		});
	},
	spawnCollectablesEveryCoupleOfSeconds: function () {
		if (this.getTimerAsSeconds() >= this.collectable_timer) { 
			if (this.level.getShouldSpawnRow()) {
				if (this.tryToSpawnCollectable(this.level.getLastTile().y)) {
					this.level.resetShouldSpawnRow();
					this.resetTimer();
				}
			}
		}
	},
	spawnCollectable: function (x, y) {
		var collectable = new Phaser.Sprite(game, x, y, 'collectable');
		game.world.addAt(collectable, 1);
		game.physics.arcade.enable(collectable);
		collectable.body.immovable = true;
		collectable.body.moves = false;
		collectable.body.setSize(collectable.width + 8, collectable.height + 8);
		collectable.body.offset.y = -4 * game.scale_factor;
		collectable.body.offset.x = -4 * game.scale_factor;
		collectable.scale.set(game.scale_factor);
		this.collectables.push(collectable);
	},
	tryToSpawnCollectable: function (y) {
		var prev_left_wall = this.level.getPrevLeftWall();
		var prev_right_wall = this.level.getPrevRightWall();

		var left_wall = this.level.getLeftWall();
		var right_wall = this.level.getRightWall();

		var prev_prev_left_size = prev_left_wall.size - prev_left_wall.rand_num;
		var prev_prev_right_size = prev_right_wall.size - prev_right_wall.rand_num;

		var side = Math.random() < 0.5;

		if (side) {
			var highest = prev_prev_left_size >= prev_left_wall.size ? prev_prev_left_size : prev_left_wall.size;

			if (left_wall.size > highest) {	
				var difference = left_wall.size - highest;
				var rand_num = utils.getRandomNumBetween(0, difference - 1);

				var x = (left_wall.size - rand_num - 1) * this.tile_size.x;

				this.spawnCollectable(x, y);
				return true;
			}
		}
		else {
			var highest = prev_prev_right_size >= prev_right_wall.size ? prev_prev_right_size : prev_right_wall.size;

			if (right_wall.size > highest) {
				var difference = right_wall.size - highest;
				var rand_num = utils.getRandomNumBetween(0, difference - 1);

				var x = ((this.world_size.x - 1) - ((right_wall.size - 1) - rand_num)) * this.tile_size.x;

				this.spawnCollectable(x, y);
				return true;
			}
		}

		return false;
	},
	playerLevelCollision: function (player) {
		this.sfx.hit.play();
		if (player.body.touching.down) {
			this.gameOver();
		}
		else {
			this.player.decrementLife();
			if (this.player.isDead()) 
				this.gameOver();
		}
	},
	playerCollectableCollision: function (player, collectable) {
		this.sfx.collect.play();
		this.level.setScrollSpeed(this.level.getScrollSpeed() + 2);

		if (this.player.getLives() < 3)
			this.player.incrementLife();

		collectable.body.enable = false;
		collectable.alpha -= 0.08;
	},
	update: function () {
		if (!this.is_paused) {
			this.level.scrollMapVertically();

			game.physics.arcade.collide(
				this.player.getSprite(),
				this.level.getCollisionLayer(),
				this.playerLevelCollision,
				null,
				this
			);

			game.physics.arcade.overlap(
				this.player.getSprite(),
				this.collectables,
				this.playerCollectableCollision,
				null,
				this
			);

			game.physics.arcade.collide(
				this.player.getEmitter(),
				this.level.getCollisionLayer(),
				function (particle) {
					particle.kill();
				},
				null,
				this
			);

			this.player.update();

			this.updateHealthBar();
			this.updateScore();

			// decicde when a collectable shoukd play its death animation
			this.collectables.forEach(function (collectable) {
				if (collectable.alpha != 1) {
					collectable.alpha -= 0.08;
					collectable.y -= 1;

					if (collectable.alpha <= 0)
						collectable.destroy();
				}
			});

			this.moveCollectables(this.level.getScrollSpeed() / 60);
			this.spawnCollectablesEveryCoupleOfSeconds();

			if (localStorage.getItem('highscore_' + game.difficulty) !== null &&
					game.score == localStorage.getItem('highscore_' + game.difficulty) &&
					!this.show_new_highscore) {
				this.show_new_highscore = true;
			}

			if (this.show_new_highscore) {
				this.new_highscore_txt.visible = true;

				this.new_highscore_txt.alpha -= 0.01;
				this.new_highscore_txt.y -= this.level.getScrollSpeed() / 60;

				if (this.new_highscore_txt.alpha <= 0) {
					this.show_new_highscore = false;
					this.new_highscore_txt.alpha = 1;
					this.new_highscore_txt.y = game.world.centerY - 50 * game.scale_factor;
					this.new_highscore_txt.visible = false;
				}
			}			
		} else {
			this.player.pauseEmitter();
		}

		if (game.device.desktop) {
			if (this.esc_key.isDown)
				game.state.start('menu');
		}
	},
	render: function () {
		/*this.level.render();
		this.player.render();

		this.collectables.forEach(function(c) {
			game.debug.body(c);
		});*/
	}
};
