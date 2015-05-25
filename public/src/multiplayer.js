var multiplayer = function(game){
	this.settings = {
		tilemap: 'assets/maps/level0.json',
		tilemap_sprite: 'assets/sprites/level0.png',

		bullet_base_frequency: 5,

		player_base_speed: 300,
		player_spawns: [{x: 520, y: 2300}],
		collisions: {min:8, max:2500},

	}	
	this.bulletTime = 0
	this.isMoving = false
	this.mouseisDown = false
	this.isAlive = true
};
  
multiplayer.prototype = {
	preload: function(){
		this.game.load.spritesheet('marine', 'assets/sprites/Soldier_Walk_Fire.png', 47, 23);
		this.game.load.tilemap('map', this.settings.tilemap, null, Phaser.Tilemap.TILED_JSON);
		this.game.load.image('ground_1x1', this.settings.tilemap_sprite);
		this.game.load.image('gunProjectile', 'assets/sprites/gun_projectile.png');
		
	},
  	create: function(){
		this.client = new Client(io);
        this.client.login(getName(5,7));

		this.game.time.advancedTiming = true;
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.map = this.game.add.tilemap('map');
		this.map.addTilesetImage('ground_1x1');
		this.map.setCollisionBetween(this.settings.collisions.min, this.settings.collisions.max);

		this.layer = this.map.createLayer('Tile Layer 1');
		this.layer.resizeWorld();

		spawn = this.getSpawn

		this.soldier = this.game.add.sprite(spawn.x, spawn.y, 'marine');
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

		this.gs = this.previous_gs = this.client.gameState
	},
	update: function(){
		this.previous_gs = _.clone(this.gs)
		this.gs = this.client.gameState

		this.diff = this.computeDiff(this.previous_gs, this.gs)

		for(i in this.diff.shots)
			this.fireEnemyBullet(this.diff.shots[i])

		for(i in this.diff.newPlayers)
			this.spawnEnemy(this.diff.newPlayers[i])

		for(i in this.diff.leftPlayers)
			this.destryEnemy(this.diff.leftPlayers[i])

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

		if(this.isMoving)
			this.client.move({x: this.soldier.x, y: this.soldier.y});

		this.soldier.rotation = this.game.physics.arcade.angleToPointer(this.soldier);
		this.game.physics.arcade.collide(this.soldier, this.layer);
		this.game.physics.arcade.collide(this.bullets, this.layer, this.collisionHandlerBulletLayer, null, this);
		
	},
	fireBullet: function() {
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
				bullet.rotation = this.game.physics.arcade.moveToPointer(bullet, 800, this.game.input.activePointer)
				this.bulletTime = this.game.time.now + 1000/this.soldierFireFrequency;

        		this.client.fire(position, bullet.rotation, Date.now());
			}
		}
	},
	fireEnemyBullet: function(bullet){
		console.log('New bullet !')
	},
	spawnEnemy: function(enemy){
		console.log('New enemy')
	},
	destryEnemy: function(enemy){
		console.log('left enemy')
	},
	enemyMovement: function(id, position){
		console.log('enemy movement')
	},
	getSpawn: function(){
		return this.player_spawns[0]
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
			}

		if(previous == null)
			return {
				newPlayers: current.players,
				leftPlayers: {},
				shots: current.shots,
				movements: {}
			}

		var newPlayers = {}
		var leftPlayers = {}
		var movements = {}

		for(p in current.players)
			if(!previous.players[p])
				newPlayers[p] = current.players[p]
			else
				if(current.players[p].position && previous.players[p].position)
					if(current.players[p].position.x != previous.players[p].position.x || current.players[p].position.y != previous.players[p].position.y)
						movements[p] = current.players[p].position

		for(p in previous.players)
			if(!current.players[p])
				leftPlayers[p] = previous.players[p]

		shotsids = []
		
		for(s in previous.shots)
			shotsids.push(previous.shots[s].id)


		if(shotsids.length)
			console.log("Shots IDs: ", shotsids)

		shots = []
		for(s in current.shots)
			if(shotsids.indexOf(s.id) == -1)
				shots.push(s)

		if(shots.length)
			console.log("Shots: ", shots)


		return {
			newPlayers: newPlayers,
			leftPlayers: leftPlayers,
			shots: shots,
			movements: movements
		}
	}
}