function decreaseDifficulty() {
	if (this.easy.visible) {
		return;
	}
	else if (this.medium.visible) {
		this.medium.visible = false;
		this.easy.visible = true;
		this.difficulty--;
	}
	else if (this.hard.visible) {
		this.hard.visible = false;
		this.medium.visible = true;
		this.difficulty--;
	}
};

function increaseDifficulty() {
	if (this.hard.visible) {
		return;
	}
	else if (this.medium.visible) {
		this.medium.visible = false;
		this.hard.visible = true;
		this.difficulty++;
	}
	else if (this.easy.visible) {
		this.easy.visible = false;
		this.medium.visible = true;
		this.difficulty++;
	}
};

function startGame() {
	console.log('Game has started');
};

var game = new Phaser.Game(
	'100%',
	'100%',
	Phaser.AUTO,
	'container',
	{	init: init,
		preload: preload,
		create: create,
		update: update }
);

function init() {
	this.game.stage.backgroundColor = '#4a4a4a';

	this.scale_factor = Math.round(window.innerWidth / 640 * 2) / 2;

	this.difficulty = 2;

	this.next_state = false;
};

function preload() {
	this.game.load.image('logo', 'static/img/logo.png');
	this.game.load.image('arrow', 'static/img/arrow.png');
	this.game.load.image('easy', 'static/img/easy.png');
	this.game.load.image('medium', 'static/img/medium.png');
	this.game.load.image('hard', 'static/img/hard.png');
	this.game.load.image('play_button', 'static/img/play_button.png');

	// how-to button image
	// highscore button image
};

function create() {
	var x = this.game.world.centerX;
	var y = this.game.world.centerY;

	this.logo = this.game.add.sprite(x, y - 100 * this.scale_factor, 'logo');
	this.logo.scale.set(this.scale_factor);
	this.logo.anchor.set(0.5);

	this.left_arrow = this.game.add.button(x - 100 * this.scale_factor, y,
		'arrow', decreaseDifficulty, this);
	this.left_arrow.scale.set(-this.scale_factor, this.scale_factor);
	this.left_arrow.anchor.set(0.5);

	this.right_arrow = this.game.add.button(x + 100 * this.scale_factor, y,
		'arrow', increaseDifficulty, this);
	this.right_arrow.scale.set(this.scale_factor);
	this.right_arrow.anchor.set(0.5);

	this.easy = this.game.add.sprite(x, y, 'easy');
	this.easy.scale.set(this.scale_factor);
	this.easy.anchor.set(0.5);
	this.easy.visible = false;

	this.medium = this.game.add.sprite(x, y, 'medium');
	this.medium.scale.set(this.scale_factor);
	this.medium.anchor.set(0.5);

	this.hard = this.game.add.sprite(x, y, 'hard');
	this.hard.scale.set(this.scale_factor);
	this.hard.anchor.set(0.5);
	this.hard.visible = false;

	this.play_button = this.game.add.button(x, y + 100 * this.scale_factor,
		'play_button', startGame, this);
	this.play_button.scale.set(this.scale_factor);
	this.play_button.anchor.set(0.5);
};

function update() {

};
