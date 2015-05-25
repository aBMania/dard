var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'gameWindow', { preload: preload, create: create, update: update, render: render });

function preload() {
	game.load.spritesheet('marine', 'assets/sprites/Soldier_Walk_Fire.png', 47, 23);
	game.load.spritesheet('alien', 'assets/sprites/Alien_Walk2.png', 70, 58);
	game.load.tilemap('map', 'encore.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('ground_1x1', 'ground_1x1.png');
	game.load.image('gunProjectile', 'assets/sprites/gun_projectile.png');
}

var cursors;
var marine;
var alien;
var aliens;

var map;
var layer;
var bullets;
var bulletTime = 0;
var isMoving = false;
var mouseisDown = false;
var tmpRotation;
var isAlive = true;

function create() {
	game.time.advancedTiming = true;
	game.physics.startSystem(Phaser.Physics.ARCADE);

	map = game.add.tilemap('map');
	map.addTilesetImage('ground_1x1');
	map.setCollisionBetween(3, 71);

	layer = map.createLayer('Tile Layer 1');
	layer.resizeWorld();

	soldier = game.add.sprite(300, 400, 'marine');
	soldier.anchor.set(0.2, 0.5);
	soldier.scale.setTo(2, 2);
	game.physics.enable(soldier, Phaser.Physics.ARCADE);
	soldier.body.allowRotation = false;
	soldier.body.fixedRotation = true;

	soldier.animations.add('walk', [0,1,2,3]);
	soldier.animations.add('fire', [4,0]);
	soldier.animations.add('fireWalk');
	soldier.body.width /= 2;
	soldier.body.offset.setTo(-15, 0);
	game.camera.follow(soldier);

	bullets = game.add.group();
	bullets.enableBody = true;
	bullets.physicsBodyType = Phaser.Physics.ARCADE;
	bullets.createMultiple(30, 'gunProjectile');
	bullets.setAll('anchor.x', 1);
	bullets.setAll('anchor.y', 0.5);
	bullets.setAll('outOfBoundsKill', true);
	bullets.setAll('checkWorldBounds', true);

	aliens = game.add.group();
	test = aliens.create(500, 500, 'alien', 0);

	aliens.callAll('animations.add', 'animations', 'walk', [0, 1, 2, 3], 5, true);
	aliens.callAll('animations.add', 'animations', 'attack', [3,4]);
	aliens.callAll('animations.add', 'animations', 'die', [5]);
    aliens.callAll('animations.play', 'animations', 'walk');
    aliens.children.forEach(function(alien){
    	alien.anchor.setTo(0.5, 0.5);
    	alien.scale.setTo(1.5, 1.5);
    	game.physics.enable(alien, Phaser.Physics.ARCADE);
    	alien.body.allowRotation = false;
		alien.body.fixedRotation = true;
		alien.body.immovable = true;
		alien.body.width -= 50;
		alien.body.height -= 50;
		alien.body.offset.setTo(-5, 0);
	});

	soldier.bringToTop();
}

function update() {
	soldier.body.velocity.x = 0;
	soldier.body.velocity.y = 0;
	soldier.body.angularVelocity = 0;
	game.physics.arcade.collide(soldier, aliens, collisionStoA, null, this);
	game.physics.arcade.collide(bullets, aliens, collisionHandler, null, this);

	if (game.input.keyboard.addKey(Phaser.Keyboard.Q).isDown)
	{
		soldier.body.velocity.x = -200;
		if (!mouseisDown)
			soldier.animations.play('walk', 6, false);
		isMoving = true;
	}
	else if (game.input.keyboard.addKey(Phaser.Keyboard.D).isDown)
	{
		soldier.body.velocity.x = 200;
		if (!mouseisDown)
			soldier.animations.play('walk', 6, false);
		isMoving = true;
	}

	if (game.input.keyboard.addKey(Phaser.Keyboard.Z).isDown)
	{
		soldier.body.velocity.y = -200;
		if (!mouseisDown)
			soldier.animations.play('walk', 6, false);
		isMoving = true;
	}
	else if (game.input.keyboard.addKey(Phaser.Keyboard.S).isDown)
	{
		soldier.body.velocity.y = 200;
		if (!mouseisDown)
			soldier.animations.play('walk', 6, false);
		isMoving = true;
	}

	if (!game.input.keyboard.addKey(Phaser.Keyboard.S).isDown && !game.input.keyboard.addKey(Phaser.Keyboard.Z).isDown && !game.input.keyboard.addKey(Phaser.Keyboard.D).isDown && !game.input.keyboard.addKey(Phaser.Keyboard.Q).isDown) {
		isMoving = false;
	}

	if (game.input.mousePointer.isDown && isAlive)
	{
		mouseisDown = true;
		if(isMoving){
			
			soldier.animations.play('fireWalk', 8, false);
			fireBullet();
		} else {
			fireBullet();
			soldier.animations.play('fire', 8, false);
		}
	} else {
		mouseisDown = false;
	}
	soldier.rotation = game.physics.arcade.angleToPointer(soldier);
	game.physics.arcade.collide(soldier, layer);
	game.physics.arcade.collide(bullets, layer, collisionHandler2, null, this);
}

function render() {
	game.debug.text("FPS : " + game.time.fps, 0, 20, 'rgba(255,0,0,1)');
}

function fireBullet() {
	bullet = bullets.getFirstExists(false);
	if (game.time.now > bulletTime) 
	{
		if (bullet)
		{
			bullet.reset(soldier.x+Math.cos(soldier.rotation)*30, soldier.y+Math.sin(soldier.rotation)*30);
			bullet.rotation = game.physics.arcade.moveToPointer(bullet, 800, game.input.activePointer);
			bulletTime = game.time.now + 200;
		}
	}
}

function collisionHandler (bullet, alien) {
	alien.animations.play('die');
	alien.body.enable = false;
	bullet.kill();
}

function collisionHandler2 (bullet, layer) {
	bullet.kill();
}

function collisionStoA(soldier, alien) {
	soldier.kill();
	isAlive = false;
}