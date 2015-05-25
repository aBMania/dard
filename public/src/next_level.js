var nextLevel = function(game){
	
};
  
nextLevel.prototype = {
	init: function(score, n){
		this.score = score
		this.nLevel = n
		localStorage.setItem("level" + n, this.score);
	},
	
	preload: function(){
	},
  	create: function(){	
        this.game.renderer.resize(size_x, size_y)
		this.game.world.setBounds(0, 0, this.game.width, this.game.height);
		
		this.game.sound.stopAll();

		win_music = this.game.add.audio('win_music');
		win_music.play();
		
  		fond = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'fond')
  		fond.anchor.set(0.5,0.5)
  		
		
		// Congratulations
		
		congratz_text = "Congratulations"
		congratz_text_x = this.game.world.centerX
		congratz_text_y = this.game.world.height*0.25
		congratz_text_width = this.game.world.width*0.7
		
		congratz_text_style = { font: "56px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: congratz_text_width, align: "center" }
	    
		text = this.game.add.text(congratz_text_x, congratz_text_y, congratz_text, congratz_text_style)
		text.anchor.set(0.5)
		
		// Finished text
		
		finished_text_content = "You finished the level " + this.nLevel + "!"
		finished_text_x = this.game.world.centerX
		finished_text_y = this.game.world.height*0.37
		finished_text_width = this.game.world.width*0.7
		
		finished_text_style = { font: "40px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: congratz_text_width, align: "center" }
	    
		finished_text_text = this.game.add.text(finished_text_x, finished_text_y, finished_text_content, finished_text_style)
		finished_text_text.anchor.set(0.5)
		
		// Score text
		
		score_text = "Score : " + this.score
		score_text_x = this.game.world.centerX
		score_text_y = this.game.world.height*0.57
		score_text_width = this.game.world.width*0.7
		
		score_text_style = { font: "40px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: congratz_text_width, align: "center" }

		text = this.game.add.text(score_text_x, score_text_y, score_text, score_text_style)
		text.anchor.set(0.5)

		// Buttons (Back to menu/Next level)

		// Common settings
		block_width = this.game.world.width*0.3
		block_spacing = this.game.world.width*0.05
		block_height = this.game.world.height*0.2
		block_radius = 10
		block_color = 0xFFFFFF

		text_x = block_width/2
		text_y = block_height/2

	    text_style = { font: "32px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: block_width, align: "center" }
		text_style_no_level = { font: "32px Arial", fill: "#FF0000", wordWrap: true, wordWrapWidth: block_width, align: "center" }


		// Back to menu
		back_to_menu_text_content = "Back to Menu"
		back_to_menu_block_x = this.game.world.centerX - block_spacing/2 - block_width
		back_to_menu_block_y = this.game.world.height*0.75

	    back_to_menu_graphic = this.game.add.graphics()

	    back_to_menu_graphic.beginFill(block_color)
	    back_to_menu_graphic.lineStyle(2, 0x000000, 1)
	    back_to_menu_graphic.drawRoundedRect(0, 0, block_width, block_height, block_radius)
	    back_to_menu_graphic.endFill()

		back_to_menu_sprite = this.game.add.sprite(back_to_menu_block_x, back_to_menu_block_y)

		back_to_menu_text = this.game.add.text(text_x, text_y, back_to_menu_text_content, text_style)
		back_to_menu_text.anchor.set(0.5)

		back_to_menu_sprite.addChild(back_to_menu_graphic)
		back_to_menu_sprite.addChild(back_to_menu_text)
		back_to_menu_sprite.anchor.set(0.5)
		back_to_menu_sprite.inputEnabled = true;
		back_to_menu_sprite.events.onInputDown.add(this.backToMenu, this);

		// Next level
		next_level_text_content = "Next level"
		next_level_text_content_no_level = "END"
		next_level_block_x = this.game.world.centerX + block_spacing/2
		next_level_block_y = back_to_menu_block_y

		next_level_graphic = this.game.add.graphics()

	    next_level_graphic.beginFill(block_color)
	    next_level_graphic.lineStyle(2, 0x000000, 1)
	    next_level_graphic.drawRoundedRect(0, 0, block_width, block_height, block_radius)
	    next_level_graphic.endFill()

		next_level_sprite = this.game.add.sprite(next_level_block_x, next_level_block_y)

		if(this.game.state.states["Level" + this.nLevel])
			next_level_text = this.game.add.text(text_x, text_y, next_level_text_content, text_style)
		else
			next_level_text = this.game.add.text(text_x, text_y, next_level_text_content_no_level, text_style_no_level)

		next_level_text.anchor.set(0.5)

		next_level_sprite.addChild(next_level_graphic)
		next_level_sprite.addChild(next_level_text)
		next_level_sprite.anchor.set(0.5)

		if(this.game.state.states["Level" + this.nLevel]){
			next_level_sprite.inputEnabled = true
			next_level_sprite.events.onInputDown.add(this.goNextLevel, this)
		}
	},
	goNextLevel: function(){
		this.game.sound.stopAll();

		game_music = this.game.add.audio('game_music');
		game_music.play()

		this.game.state.start("Level" + this.nLevel)
	},
	backToMenu: function(){
		this.game.sound.stopAll()

		game_music = this.game.add.audio('menu_music')
		game_music.play()

		this.game.state.start("Menu")
	}
}