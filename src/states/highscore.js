var highscore = function () {};

highscore.prototype = {
	retrieveHighscores: function () {
		var url = undefined;
		if (game.difficulty == 1)
			url = 'lib/retrieve_highscores_easy.php';
		else if (game.difficulty == 2)
			url = 'lib/retrieve_highscores_medium.php';
		else if (game.difficulty == 3)
			url = 'lib/retrieve_highscores_hard.php';

    $.ajax({    //create an ajax request to load_page.php
	    type: "GET",
	    url: url,             
	    dataType: "html",   //expect html to be returned                
	    success: function(response){                    
	        $('#highscores').html(response);
	        $('#highscores').show();
	        $('#highscores').css({'min-width': 265 * game.scale_factor,
	      												'font-size': 14 * game.scale_factor});
	        $('#submit_highscore > input').css({'font-size': 14 * game.scale_factor});
	        $('#submit_highscore input[name=\'name\']').css({width: 120 * game.scale_factor});
	        $('#submit_highscore input[name=\'score\']').css({width: 60 * game.scale_factor});


					var best = localStorage.getItem('highscore_' + game.difficulty);
					best = best ? best : 0;
	        $('#submit_highscore > input[name="score"]').val(best);
	        $('#submit_highscore').show();

	       	var sh_ele = $('#submit_highscore');

	       	var x = game.world.centerX - sh_ele.width() / 2;
	       	var y = game.world.centerY - sh_ele.height() / 2;

	       	sh_ele.css({left: x, top: y + 25 * game.scale_factor});

	       	var h_ele = $('#highscores');

	       	x = game.world.centerX - h_ele.width() / 2;
	       	y = game.world.centerY - h_ele.height();

	       	h_ele.css({left: x, top: y});
	    }
    });
	},
	makeHighscoreSubmitable: function () {
		var url = undefined;
		if (game.difficulty == 1)
			url = 'lib/submit_highscore_easy.php';
		else if (game.difficulty == 2)
			url = 'lib/submit_highscore_medium.php';
		else if (game.difficulty == 3)
			url = 'lib/submit_highscore_hard.php';

		var form = $('#submit_highscore');
		var self = this;
		form.unbind('submit').submit(function (e) {
			$.ajax({
				type: form.attr('method'),
				url: url,
				data: form.serialize(),
				success: function (data) {
					if (data === 'succes') {
						self.retrieveHighscores();
					}
				}
			});

			e.preventDefault();
		});
	},
	changeToMenuState: function () {
		$('#highscores').hide();
		$('#submit_highscore').hide();

		game.state.start('menu');
	},
	init: function () {
		var x = game.world.centerX;
		var y = game.world.centerY;

		this.background = game.make.sprite(x, y, 'background');
		this.background.scale.set(game.scale_factor);
		this.btn_back = game.make.button(x, y + 100 * game.scale_factor, 'btn_back', this.changeToMenuState, this);
		this.btn_back.scale.set(game.scale_factor);

		utils.centerGameObjects([this.background, this.btn_back]);

		if (game.device.desktop) {
			this.esc_key = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
			this.space_key = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			game.input.keyboard.addKeyCapture([Phaser.Keyboard.ESC, Phaser.Keyboard.SPACEBAR]);
		}
	},
	create: function () {
		game.add.existing(this.background);
		game.add.existing(this.btn_back);

		this.retrieveHighscores();
		this.makeHighscoreSubmitable();
	},
	update: function () {
		if (game.device.desktop) {
			if (this.esc_key.isDown || this.space_key.isDown) {
				this.changeToMenuState();
			}
		}
	}
}