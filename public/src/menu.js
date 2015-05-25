var menu = function(game){
	
};

menu.prototype = {
	preload: function(){
    	this.game.load.spritesheet('monoplayer', 'assets/images/buttons/monoplayer.png', 180, 50);
    	this.game.load.spritesheet('multiplayer', 'assets/images/buttons/multiplayer.png', 180, 50);
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

		this.game.sound.play('menu_music');

    	b_multiplayer = this.game.add.button(this.game.world.centerX - 180/2, 450, 'multiplayer', this.onMultiplayer, this, 1, 0);
    	b_monoplayer = this.game.add.button(this.game.world.centerX - 180/2, 350, 'monoplayer', this.onMonoplayer, this, 1, 0);

	},
	onMonoplayer: function(){
		this.game.state.start("LevelSelection");
	},
	onMultiplayer: function(){
		this.game.state.start("Multiplayer");
	},
	onOptions: function(){
		this.game.state.start("Options");
	}
}