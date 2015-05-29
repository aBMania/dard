var multiplayer = function(game){
	this.settings = {
		tilemap: 'assets/maps/level0.json',
		tilemap_sprite: 'assets/sprites/level0.png',

		bullet_base_frequency: 5,
	
		bullet_speed: 800,
		player_base_speed: 300,
		player_spawns: [{x: 520, y: 2300}, {x :68, y:295}, {x :744, y:158}, {x :1744, y:410}, {x :1796, y:1150}, {x :244, y:1204}],
		collisions: {min:8, max:2500},

	}	
	this.bulletTime = 0
	this.isMoving = false
	this.mouseisDown = false
	this.isAlive = true
};
  
multiplayer.prototype = {
	preload: function(){
		this.game.load.spritesheet('marine0', 'assets/sprites/soldier_bleu.png', 47, 23);
		this.game.load.spritesheet('marine1', 'assets/sprites/soldier_rouge.png', 47, 23);
		this.game.load.spritesheet('marine2', 'assets/sprites/soldier_vert.png', 47, 23);
		this.game.load.spritesheet('marine3', 'assets/sprites/soldier_violet.png', 47, 23);
		this.game.load.tilemap('map', this.settings.tilemap, null, Phaser.Tilemap.TILED_JSON);
		this.game.load.image('ground_1x1', this.settings.tilemap_sprite);
		this.game.load.image('gunProjectile', 'assets/sprites/gun_projectile.png');
		
	},
  	create: function(){
  		// Client qui nous permettra d'envoyer et recevoir les informations
		this.client = new Client(io);
		
		// On se connecte avec un pseudo aléatoire
        this.client.login(getName(5,7));

		this.game.time.advancedTiming = true;
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.map = this.game.add.tilemap('map');
		this.map.addTilesetImage('ground_1x1');
		this.map.setCollisionBetween(this.settings.collisions.min, this.settings.collisions.max);

		this.layer = this.map.createLayer('Tile Layer 1');
		this.layer.resizeWorld();

		// Récupère un spawn (peut etre choisi parmi plusieurs pour éviter les spawn-kill)
		var spawn = this.getSpawn()

		this.soldier = this.game.add.sprite(spawn.x, spawn.y, 'marine0');
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

		this.soldier.bringToTop()

		this.soldierSpeed = this.settings.player_base_speed
		this.soldierFireFrequency = this.settings.bullet_base_frequency

		// Groupe phaser des enemis
		this.enemyGroup = this.game.add.group();
		
		// Groupe phaser des tirs enemis
		this.enemyBullet = this.game.add.group();
		this.enemyBullet.enableBody = true;
		this.enemyBullet.physicsBodyType = Phaser.Physics.ARCADE;
		this.enemyBullet.setAll('anchor.x', 1);
		this.enemyBullet.setAll('anchor.y', 0.5);
		this.enemyBullet.setAll('outOfBoundsKill', true);
		this.enemyBullet.setAll('checkWorldBounds', true);


		// Log background
		
		var graphic = this.game.add.graphics(0,0);

		
		graphic.beginFill(0xFFFFFF, 1);
		graphic.lineStyle(2, 0x000000, 1)
		graphic.drawRect(this.game.camera.width - 300, this.game.camera.height - 150, 300, 150)
		graphic.endFill()
		graphic.fixedToCamera = true
		graphic.alpha = 0.5
		
		// Tableau associatif qui contiendra les enemis
		// La clé de chaque valeur est l'ID du joueur
		this.enemies = {}
		
		this.loglen = 0
		
		// On initialise l'état du jeu (à null)
		this.gs = this.previous_gs = this.client.gameState;
	},
	update: function(){
		// Enregistre le dernier état du jeu
		this.previous_gs = _.clone(this.gs)
		
		// Récupère l'état du jeu courrant 
		this.gs = this.client.gameState;	 

		// Calcul de la différence entre le dernier état de jeu et l'état courant
		this.diff = this.computeDiff(this.previous_gs, this.gs);


		// On affiche chaque nouveau tir
		for(var i in this.diff.shots)
			this.fireEnemyBullet(this.diff.shots[i])

		// On ajoute chaque nouveau joueur
		for(i in this.diff.newPlayers)
			this.spawnEnemy(i, this.diff.newPlayers[i])
	
		// On retire les enemis qui ont quitté
		for(i in this.diff.leftPlayers)
			this.destroyEnemy(i, this.diff.leftPlayers[i])
		
		// On fait bouger les enemis
		for(i in this.diff.movements)
			this.enemyMovement(i, this.diff.movements[i])

		this.soldier.body.velocity.x = 0;
		this.soldier.body.velocity.y = 0;
		this.soldier.body.angularVelocity = 0;

		if (this.game.input.keyboard.addKey(Phaser.Keyboard.Q).isDown)
		{
			this.soldier.body.velocity.x = -this.soldierSpeed;
			if (!this.mouseisDown)
				this.soldier.animations.play('walk', 6, false);
			this.isMoving = true;
		}
		else if (this.game.input.keyboard.addKey(Phaser.Keyboard.D).isDown)
		{
			this.soldier.body.velocity.x = this.soldierSpeed;
			if (!this.mouseisDown)
				this.soldier.animations.play('walk', 6, false);
			this.isMoving = true;
		}

		if (this.game.input.keyboard.addKey(Phaser.Keyboard.Z).isDown)
		{
			this.soldier.body.velocity.y = -this.soldierSpeed;
			if (!this.mouseisDown)
				this.soldier.animations.play('walk', 6, false);
			this.isMoving = true;
		}
		else if (this.game.input.keyboard.addKey(Phaser.Keyboard.S).isDown)
		{
			this.soldier.body.velocity.y = this.soldierSpeed;
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


		this.client.move({x: this.soldier.x, y: this.soldier.y, rotation: this.soldier.rotation});

		this.soldier.rotation = this.game.physics.arcade.angleToPointer(this.soldier);
		this.game.physics.arcade.collide(this.soldier, this.layer);
		this.game.physics.arcade.collide(this.bullets, this.layer, this.collisionHandlerBulletLayer, null, this);
		this.game.physics.arcade.collide(this.enemyBullet, this.layer, this.collisionHandlerBulletLayer, null, this);
		this.game.physics.arcade.collide(this.enemyBullet, this.soldier, this.killed, null, this);
		
		this.game.physics.arcade.collide(this.bullets, this.enemyGroup, this.collisionHandlerBulletLayer, null, this);
		
		
		if(this.client.log.length > this.loglen)
		{
			
			var log_txt_style = { font: '10pt Comic Sans Ms', fill: 'black', align: 'left', wordWrap: true, wordWrapWidth: 260 };
		    var log_txt = "";
		    
		    var toWrite = _.last(this.client.log, 5)
		    
			for(i in toWrite)
				log_txt += toWrite[i] + "\n"
			if(this.logBox)
				this.game.world.remove(this.logBox)
				
		    this.logBox = this.game.add.text(this.game.camera.width-280, this.game.camera.height-140, log_txt, log_txt_style);
		    this.logBox.fixedToCamera = true
		    
		    this.loglen = this.client.log.length
		}
	},
	fireBullet: function() {
		//console.log("{x :"+this.soldier.x+", y:"+this.soldier.y+"}")
		bullet = this.bullets.getFirstExists(false);
		if (this.game.time.now > this.bulletTime) 
		{
			if (bullet)
			{
				var position = {
					x: this.soldier.x+Math.cos(this.soldier.rotation)*30,
					y: this.soldier.y+Math.sin(this.soldier.rotation)*30
				}
				

				bullet.reset(position.x, position.y);
				bullet.rotation = this.game.physics.arcade.moveToPointer(bullet, this.settings.bullet_speed, this.game.input.activePointer)
				this.bulletTime = this.game.time.now + 1000/this.soldierFireFrequency;
				
				// Envoie le tir au serveur
        		this.client.fire({ position: position, rotation: bullet.rotation, time: Date.now()});
			}
		}
	},
	fireEnemyBullet: function(bullet){
		/* Tir d'enemi

			bullet : {
				id: ... (ID unique du tir)
				playerId: ... (ID unique du joueur)
				data: {
					position: {x: ... , y: ...}
					rotation: ...
					time: ... (Date.now())
				}
			}
		*/


		var x = bullet.data.position.x
		var y = bullet.data.position.y

		var b = this.enemyBullet.create(x, y, 'gunProjectile', 0);
		
		this.game.physics.arcade.enableBody(b);
        b.enableBody = true;
		b.rotation = bullet.data.rotation
		

		
		b.body.velocity.x = this.settings.bullet_speed*Math.cos(b.rotation)
		b.body.velocity.y = this.settings.bullet_speed*Math.sin(b.rotation)
		b.playerId = bullet.playerId
	},
	spawnEnemy: function(id, enemy){
		this.enemies[id] = this.enemyGroup.create(0, 0, 'marine'+_.random(1, 3), 0);
		
		this.enemies[id].anchor.set(0.2, 0.5);
		this.enemies[id].scale.setTo(2, 2);
		this.game.physics.enable(this.enemies[id], Phaser.Physics.ARCADE);
		this.enemies[id].body.allowRotation = false;
		this.enemies[id].body.fixedRotation = true;

		this.enemies[id].animations.add('walk', [0,1,2,3]);
		this.enemies[id].animations.add('fire', [4,0]);
		this.enemies[id].animations.add('fireWalk');
		this.enemies[id].body.width /= 2;
		this.enemies[id].body.offset.setTo(-15, 0);
		this.enemies[id].immovable = true;
		
		if(enemy.position){
			this.enemies[id].x = enemy.position.x;
			this.enemies[id].y = enemy.position.y;
			this.enemies[id].rotation = enemy.position.rotation;
		}
	},
	destroyEnemy: function(id, enemy){
		this.enemies[id].kill();
	},
	enemyMovement: function(id, position){
		this.enemies[id].x = position.x;
		this.enemies[id].y = position.y;
		this.enemies[id].rotation = position.rotation;
	},
	getSpawn: function(){
		return this.settings.player_spawns[Math.floor(Math.random()*this.settings.player_spawns.length)];
	},
	killed: function(soldier, bullet){
		this.client.die(bullet.playerId)
		bullet.kill();
		var spawn = this.getSpawn()
		soldier.x = spawn.x
		soldier.y = spawn.y
	},
	collisionHandlerBulletLayer: function(bullet, layer) {
		bullet.kill();
	},
	computeDiff: function(previous, current){
		if(current == null)
			return {
				newPlayers: {},
				leftPlayers: {},
				shots: {},
				movements: {}
			};

		if(previous == null)
			return {
				newPlayers: current.players,
				leftPlayers: {},
				shots: current.shots,
				movements: {}
			}

		var newPlayers = {};
		var leftPlayers = {};
		var movements = {};

		for(p in current.players)
			if(!previous.players[p])
				newPlayers[p] = current.players[p]
			else
				if(current.players[p].position && previous.players[p].position)
					if(current.players[p].position.x != previous.players[p].position.x 
						|| current.players[p].position.y != previous.players[p].position.y
						|| current.players[p].rotation != previous.players[p].position.y)
							movements[p] = current.players[p].position

		for(p in previous.players)
			if(!current.players[p])
				leftPlayers[p] = previous.players[p]

		shotsids = []
		
		for(s in previous.shots)
			shotsids.push(previous.shots[s].id)


		shots = []
		for(s in current.shots)
			if(shotsids.indexOf(current.shots[s].id) == -1)
				shots.push(current.shots[s])

		return {
			newPlayers: newPlayers,
			leftPlayers: leftPlayers,
			shots: shots,
			movements: movements
		}
	}
}