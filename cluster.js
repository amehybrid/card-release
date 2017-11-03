var cluster = require('cluster');

if (cluster.isMaster) {
	// CPU count
	var cpuCount = require('os').cpus().length;
	console.log('number of cpus: ' + cpuCount);

	// spawn child per cpu
	for (var x = 0; x < cpuCount; x++) {
		spawnChild();
	}

	// autogenerate new child when a child dies
	cluster.on('exit', spawnChild);

	function spawnChild () {
		cluster.fork();
	}

} else {
	require('./server');
}