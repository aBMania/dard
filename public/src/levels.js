var levels = [];

levels.push(new Level(1, {

}));

levels.push(new Level(2, {
	tilemap: 'assets/maps/level0.json',
	tilemap_sprite: 'assets/sprites/level0.png',

	bullet_frequency: 4,

	player_speed: 300,
	alien_speed: 300,

	aggro_range: 300,
	aggro_ratio: 700
}));

levels.push(new Level(3, {
	tilemap: 'assets/maps/level0.json',
	tilemap_sprite: 'assets/sprites/level0.png',

	bullet_frequency: 2,

	player_speed: 300,
	alien_speed: 350,

	aggro_range: 350,
	aggro_ratio: 600
}));

/*
levels.push(new Level(4, {

}));
*/