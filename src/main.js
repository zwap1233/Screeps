//		main.js
// Created on:	18/04/2020
// Author:		Wouter Schoenmakers
// email:		woutereldar@gmail.com

const version = require('version');
const operationsDirector = require('operations/operationsDirector');

global.CreepRole = {
	MINER: 'miner'
};

global.Director = {
	OPERATIONS: 'operations',
	MILITARY: 'military',
	LOGISTICS: 'logistics'
};

module.exports.loop = function() {
	if(version.checkVersion()) {
		operationsDirector.init();
	}

	for(var name in Memory.creeps) {
		if(!Game.creeps[name]) {
			delete Memory.creeps[name];
		}
	}

	operationsDirector.update();

	//console.log(Game.cpu.getUsed());
};
