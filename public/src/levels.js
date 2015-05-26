var levels = [];

levels[0] = new Level(1, {

});

levels[1] = new Level(2, {
		tilemap: 'assets/maps/level0.json',
		tilemap_sprite: 'assets/sprites/level0.png',

		bullet_frequency: 4,

		player_speed: 280,
		alien_speed: 400,

		aggro_range: 300,
		aggro_ratio: 700
});

levels[2] = new Level(3, {
		tilemap: 'assets/maps/level0.json',
		tilemap_sprite: 'assets/sprites/level0.png',

		bullet_frequency: 2,

		player_speed: 300,
		alien_speed: 450,

		aggro_range: 350,
		aggro_ratio: 600
});
