var menu = function(game){
	
};

menu.prototype = {
	preload: function(){
    	this.game.load.spritesheet('monoplayer', 'assets/images/buttons/monoplayer.png', 224, 54);
    	this.game.load.spritesheet('multiplayer', 'assets/images/buttons/multiplayer.png', 224, 54);
	},
  	create: function(){
		var fond = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'fond')
		var title1 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'title1')
		var title2 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'title2')
		var title3 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'title3')
		
		fond.anchor.set(0.5,0.5)
		title1.anchor.set(0.5,0.5)
		title2.anchor.set(0.5,0.5)
		title3.anchor.set(0.5,0.5)

		this.game.sound.play('menu_music');
		
		var button_width = 224
		
    	var b_multiplayer = this.game.add.button(this.game.world.centerX - button_width/2, this.game.world.height*0.75, 'multiplayer', this.onMultiplayer, this, 1, 0);
    	var b_monoplayer = this.game.add.button(this.game.world.centerX - button_width/2, this.game.world.height*0.62, 'monoplayer', this.onMonoplayer, this, 1, 0);

	},
	onMonoplayer: function(){
		this.game.state.start("LevelSelection");
	},
	onMultiplayer: function(){
		this.game.sound.stopAll();
		this.game.sound.play('game_music');
		this.game.state.start("Multiplayer");
	},
	onOptions: function(){
		this.game.state.start("Options");
	}
}