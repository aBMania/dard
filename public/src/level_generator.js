var Level = function(n, user_settings){

	var settings = {
		tilemap: 'assets/maps/level0.json',
		tilemap_sprite: 'assets/sprites/level0.png',

		bullet_frequency: 5,

		player_speed: 300,
		player_spawn: {x: 520, y: 2300},
		collisions: {min:8, max:2500},

		aliens: [{x:146,  y:2015}, {x:249,  y:2297}, {x:760,  y:2030}, {x:488,  y:1765}, {x:773,  y:1695}, {x:356,  y:1430}, {x:831,  y:1331}, {x:715,  y:871}, {x:290,  y:1033}, {x:990,  y:987}, {x:1233,  y:1121}, {x:1368,  y:829}, {x:834,  y:651}, {x:1781,  y:740}, {x:1756,  y:1132}, , {x:1752,  y:448}, {x:1352,  y:438}, {x:1088,  y:229}, {x:439,  y:522}, {x:432,  y:355}, {x:42,  y:291}, {x:480,  y:47}, {x:268,  y:739}, {x:866,  y:77}, {x:581,  y:287}, {x:1164,  y:379}, {x:1284,  y:1236}, {x:484,  y:1575}],
		alien_speed: 300,

		aggro_range: 250,
		aggro_ratio: 900
	}

	_.extend(settings, user_settings)


	var level = function(game){
		this.bulletTime = 0
		this.isMoving = false
		this.mouseisDown = false
		this.isAlive = true
	};

	level.prototype = {
		
		preload: function(){
			this.game.load.spritesheet('marine', 'assets/sprites/Soldier_Walk_Fire.png', 47, 23);
			this.game.load.spritesheet('alien', 'assets/sprites/Alien_Walk2.png', 70, 58);
			this.game.load.tilemap('map', settings.tilemap, null, Phaser.Tilemap.TILED_JSON);
			this.game.load.image('ground_1x1', settings.tilemap_sprite);
			this.game.load.image('gunProjectile', 'assets/sprites/gun_projectile.png');
		},
	  	create: function(){

			this.game.time.advancedTiming = true;
			this.game.physics.startSystem(Phaser.Physics.ARCADE);

			this.map = this.game.add.tilemap('map');
			this.map.addTilesetImage('ground_1x1');
			this.map.setCollisionBetween(settings.collisions.min, settings.collisions.max);

			this.layer = this.map.createLayer('Tile Layer 1');
			this.layer.resizeWorld();

			this.soldier = this.game.add.sprite(settings.player_spawn.x, settings.player_spawn.y, 'marine');
			this.soldier.anchor.set(0.2, 0.5);
			this.soldier.scale.setTo(2, 2);
			this.game.physics.enable(this.soldier, Phaser.Physics.ARCADE);
			this.soldier.body.allowRotation = false;
			this.soldier.body.fixedRotation = true;

			this.soldier.animations.add('walk', [0,1,2,3]);
			this.soldier.animations.add('fire', [4,0]);
			this.soldier.animations.add('fireWalk');
			this.soldier.body.width /= 2;
			this.soldier.body.offset.setTo(-15, 0);
			this.game.camera.follow(this.soldier);

			this.bullets = this.game.add.group();
			this.bullets.enableBody = true;
			this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
			this.bullets.createMultiple(30, 'gunProjectile');
			this.bullets.setAll('anchor.x', 1);
			this.bullets.setAll('anchor.y', 0.5);
			this.bullets.setAll('outOfBoundsKill', true);
			this.bullets.setAll('checkWorldBounds', true);

			this.aliens = this.game.add.group();
			this.aliensNb = 0; // Nombre d'aliens présents au début
			for(i in settings.aliens){
			    this.SpawnAlien(this.aliens, settings.aliens[i].x, settings.aliens[i].y);
			    this.aliensNb += 1;
			}

			this.aliensCount = this.aliensNb; // Nombre d'aliens au cours du jeu

			this.aliens.callAll('animations.add', 'animations', 'walk', [0, 1, 2, 3], 5, true);
			this.aliens.callAll('animations.add', 'animations', 'attack', [3,4]);
			this.aliens.callAll('animations.add', 'animations', 'die', [5]);
		    this.aliens.callAll('animations.play', 'animations', 'walk');
		    this.aliens.children.forEach(function(alien){
		    	alien.anchor.setTo(0.5, 0.5);
		    	alien.scale.setTo(1.5, 1.5);
		    	this.game.physics.enable(alien, Phaser.Physics.ARCADE);
		    	alien.body.allowRotation = false;
				alien.body.fixedRotation = true;
				alien.body.immovable = true;
				alien.body.width -= 50;
				alien.body.height -= 50;
				alien.body.offset.setTo(-5, 0);
			});

			this.soldier.bringToTop();
			this.aggro_range = settings.aggro_range;
			this.score = 0; // Initialisation du score
		},
		update: function(){
			this.aggro_range += this.game.time.totalElapsedSeconds()/settings.aggro_ratio;
			aggro_range_tmp = this.aggro_range;

			this.soldier.body.velocity.x = 0;
			this.soldier.body.velocity.y = 0;
			this.soldier.body.angularVelocity = 0;
			this.game.physics.arcade.collide(this.soldier, this.aliens, this.collisionStoA, null, this);
			this.game.physics.arcade.collide(this.bullets, this.aliens, this.collisionHandler, null, this);
			if (this.game.input.keyboard.addKey(Phaser.Keyboard.Q).isDown)
			{
				this.soldier.body.velocity.x = -settings.player_speed;
				if (!this.mouseisDown)
					this.soldier.animations.play('walk', 6, false);
				this.isMoving = true;
			}
			else if (this.game.input.keyboard.addKey(Phaser.Keyboard.D).isDown)
			{
				this.soldier.body.velocity.x = settings.player_speed;
				if (!this.mouseisDown)
					this.soldier.animations.play('walk', 6, false);
				this.isMoving = true;
			}

			if (this.game.input.keyboard.addKey(Phaser.Keyboard.Z).isDown)
			{
				this.soldier.body.velocity.y = -settings.player_speed;
				if (!this.mouseisDown)
					this.soldier.animations.play('walk', 6, false);
				this.isMoving = true;
			}
			else if (this.game.input.keyboard.addKey(Phaser.Keyboard.S).isDown)
			{
				this.soldier.body.velocity.y = settings.player_speed;
				if (!this.mouseisDown)
					this.soldier.animations.play('walk', 6, false);
				this.isMoving = true;
			}

			if (!this.game.input.keyboard.addKey(Phaser.Keyboard.S).isDown && 
					!this.game.input.keyboard.addKey(Phaser.Keyboard.Z).isDown && 
					!this.game.input.keyboard.addKey(Phaser.Keyboard.D).isDown && 
					!this.game.input.keyboard.addKey(Phaser.Keyboard.Q).isDown) {

				this.isMoving = false;
			}

			if (this.game.input.mousePointer.isDown && this.isAlive)
			{
				this.mouseisDown = true;
				if(this.isMoving){
					
					this.soldier.animations.play('fireWalk', 8, false);
					this.fireBullet();
				} else {
					this.fireBullet();
					this.soldier.animations.play('fire', 8, false);
				}
			} else {
				this.mouseisDown = false;
			}

			this.soldier.rotation = this.game.physics.arcade.angleToPointer(this.soldier);
			this.game.physics.arcade.collide(this.soldier, this.layer);
			this.game.physics.arcade.collide(this.aliens, this.layer);
			this.game.physics.arcade.collide(this.bullets, this.layer, this.collisionHandler2, null, this);
			
			var self = this;
			this.aliens.children.forEach(function(alien){
				if (this.game.physics.arcade.distanceBetween(alien, self.soldier) <= aggro_range_tmp ) {
					self.AlienFollow(alien);
				}
			});

			if(this.score <= 0) {
				this.score = 0;
			}

			if (this.aliensCount <= 0) {
				if(this.aggro_range <= 600) {
					this.score += 1000;
				} else if (this.aggro_range <= 800) {
					this.score += 500;
				} else if (this.aggro_range <= 1000) {
					this.score += 250;
				}

				score = this.score;
				game.state.start('NextLevel', true, false, score, n);
			}
		},
		render: function() {
			this.game.debug.text("FPS : " + this.game.time.fps, 0, 20, 'rgba(255,0,0,1)');
		},
		fireBullet: function() {
			bullet = this.bullets.getFirstExists(false);
			if (this.game.time.now > this.bulletTime) 
			{
				if (bullet)
				{
					bullet.reset(this.soldier.x+Math.cos(this.soldier.rotation)*30, this.soldier.y+Math.sin(this.soldier.rotation)*30);
					bullet.rotation = this.game.physics.arcade.moveToPointer(bullet, 800, this.game.input.activePointer);
					this.bulletTime = this.game.time.now + 1000/settings.bullet_frequency;
					this.score -= 5;
				}
			}
		},
		collisionHandler: function(bullet, alien) {
			this.AlienDie(bullet, alien);
		},

		collisionHandler2: function(bullet, layer) {
			bullet.kill();
		},

		collisionStoA: function(soldier, alien) {
			soldier.kill();
			isAlive = false;
			this.game.state.restart()
		},

		SpawnAlien: function(aliens, posX, posY) {
			return aliens.create(posX, posY, 'alien', 0);
		},

		AlienFollow: function(alien) {
			this.game.physics.arcade.moveToObject(alien, this.soldier, settings.alien_speed);
			if (alien.body.enable == true)
				alien.rotation = this.game.physics.arcade.moveToObject(alien, this.soldier, settings.alien_speed);
		},

		AlienDie: function(bullet, alien) {
			alien.animations.play('die');
			alien.body.enable = false;
			bullet.kill();
			this.aliensCount -= 1;
			this.score += 66;
		}
	};

	return level;
}