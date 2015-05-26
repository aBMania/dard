var levelSelection = function(game){
	
};

  
levelSelection.prototype = {
	preload: function(){
        
	},
  	create: function(){
		fond = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'fond')
		title1 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'title1')
		title2 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'title2')
		title3 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'title3')
		fond.anchor.set(0.5,0.5)
		title1.anchor.set(0.5,0.5)
		title2.anchor.set(0.5,0.5)
		title3.anchor.set(0.5,0.5)
		
	    var n = 6;

	    // set a fill and line style

	    var block_color = 0xFFFFFF;
	    var block_per_row = 2;

	    var block_height = 60;
	    var block_width = this.game.world.width*0.3;
	    var block_spacing_horizontal = 10;
	    var block_spacing_vertical = 20;

	    var block_left_margin = this.game.world.centerX - block_width*block_per_row/2;
	    var block_top_margin = 350
	    var block_radius = 10;

	    var text_style = { font: "32px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: block_width, align: "center" }
		var text_style_no_level = { font: "32px Arial", fill: "#FF0000", wordWrap: true, wordWrapWidth: block_width, align: "center" }

	    this.levels = []

	    for(var i = 0; i < n; i++)
	    {
	    	var col = i % block_per_row;
	    	var row = Math.floor(i/block_per_row);

		    var x = block_left_margin + col*(block_spacing_horizontal + block_width)
		    var y = block_top_margin + row*(block_spacing_vertical + block_height)

		    var text_x = block_width/2
		    var text_y = block_height/2

		    var graphic = this.game.add.graphics();

		    graphic.beginFill(block_color)
		    graphic.lineStyle(2, 0x000000, 1)
		    graphic.drawRoundedRect(0, 0, block_width, block_height, block_radius)
		    graphic.endFill()

		    var text;

		    if(this.game.state.states["Level" + i])
		    	if(localStorage.getItem("level" + i) || i == 0)
		    		text = this.game.add.text(text_x, text_y, "Level " + (i+1), text_style)
		    	else
   					text = this.game.add.text(text_x, text_y, "Locked", text_style_no_level)
   			else
   				text = this.game.add.text(text_x, text_y, "Level " + (i+1) + " (released soon)", text_style_no_level)

    		text.anchor.set(0.5)

		    this.levels[i] = this.game.add.sprite(x, y)
		    this.levels[i].addChild(graphic)
		    this.levels[i].addChild(text)
		    this.levels[i].anchor.set(0.5)

		    this.levels[i].inputEnabled = true

		    if(localStorage.getItem("level" + i) || i == 0)
		    	this.levels[i].events.onInputDown.add((this.selectLevel)(i), this);

	    }
	},
	selectLevel: function(i){
		return function(){ 
			if(this.game.state.states["Level" + i])
				this.goToLevel(i)
		}
	},
	goToLevel: function(i){
		
		this.game.sound.stopAll();
		this.game.sound.play('game_music');

		this.game.state.start("Level" + i);
	}
}