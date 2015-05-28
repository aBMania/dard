var boot = function(game){
	
};
  
boot.prototype = {
	preload: function(){
        this.game.load.audio('menu_music', 'assets/audio/menu.mp3', 1, true)
		this.game.load.audio('game_music', 'assets/audio/game.mp3', 1, true);
		this.game.load.audio('win_music', 'assets/audio/win.mp3', 1, true);
        this.game.load.spritesheet('continue', 'assets/images/buttons/continue.png', 224, 54)
        this.game.load.image('fond', 'assets/images/fond.png');
        this.game.load.image('title1', 'assets/images/die.png');
        this.game.load.image('title2', 'assets/images/and.png');
        this.game.load.image('title3', 'assets/images/redie.png');
	},
  	create: function(){
		this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
		this.scale.pageAlignHorizontally = true
		this.scale.setScreenSize()

		this.game.stage.backgroundColor = "#150F22"

		fond = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'fond')
		fond.anchor.set(0.5,0.5)

		title1 = this.game.add.sprite(1.5*this.game.world.width, this.game.world.centerY, 'title1')
		title2 = this.game.add.sprite(1.5*this.game.world.width, this.game.world.centerY, 'title2')
		title3 = this.game.add.sprite(1.5*this.game.world.width, this.game.world.centerY, 'title3')
		
		if(title1.height > this.game.height && title1.width > this.game.width)
		{
			title1.height = this.game.height;
	    	title1.width  = this.game.width;
			title2.height = this.game.height;
	    	title2.width  = this.game.width;
			title3.height = this.game.height;
	    	title3.width  = this.game.width;
			fond.height = this.game.height;
	    	fond.width  = this.game.width;
		}
		title1.anchor.set(0.5,0.5)
		title2.anchor.set(0.5,0.5)
		title3.anchor.set(0.5,0.5)

		this.game.physics.enable(title1, Phaser.Physics.ARCADE);
		this.game.physics.enable(title2, Phaser.Physics.ARCADE);
		this.game.physics.enable(title3, Phaser.Physics.ARCADE);

		
		title1.body.velocity.x = -2000


	    var text_style = { font: "32px Arial", fill: "#000000", align: "center" }
   		this.loading = this.game.add.text(this.game.world.centerX, this.game.world.height*0.6, "Loading...", text_style)
    	this.loading.anchor.set(0.5)

		music = this.game.add.audio('menu_music')
    	music.onDecoded.add(this.printContinue, this)
	},
	printContinue: function(){
		this.game.world.remove(this.loading)
		button_width = 224
		b_continue = this.game.add.button(this.game.world.centerX - button_width/2, this.game.world.height*0.6, 'continue', this.onContinue, this, 1, 0)
	},
	onContinue: function(){
		this.scale.startFullScreen()
		this.game.state.start("Menu")
	},
	update: function(){
		if(title1.body.x <= this.game.world.centerX/3){
			title1.body.velocity.x = 0
			title2.body.velocity.x = -2000
		}

		if(title2.body.x <= this.game.world.centerX/3){
			title2.body.velocity.x = 0
			title3.body.velocity.x = -2000
		}

		if(title3.body.x <= this.game.world.centerX/3)
			title3.body.velocity.x = 0
	}

	
}