//		operationsDirector.js
// Created on:	22/04/2020
// Author:		Wouter Schoenmakers
// email:		woutereldar@gmail.com

var operationsDirector = {

	/**
	 * Setups director, called once every time new code is uploaded.
	 */
	init: function() {
		for(const name in Game.rooms) {
			this.initRoom(Game.rooms[name]);
		}
	},

	update: function() {
		for(const name in Game.rooms) {
			this.updateRoom(Game.rooms[name]);
		}
	},

	/**
	 * Setups a room memory, is called once every time code is uploaded.
	 * @param {Room} room 
	 */
	initRoom: function(room) {
		if(room.memory.maxMiners === null) {
			room.memory.maxMiners = 4;
		}

		if(room.memory.mining.srcIndex === null) {
			room.memory.mining.srcIndex = 0;
		}

		if(room.memory.mining.sources === null) {
			var i = 0;
			room.find(FIND_SOURCES).forEach(src => {
				room.memory.mining.sources[i] = src.id;
				i++;
			});
		}

		if(room.memory.mining.dstIndex === null) {
			room.memory.mining.srcIndex = 0;
		}

		if(room.memory.mining.destinations === null) {
			var i = 0;
			room.find(FIND_MY_STRUCTURES, {
				filter: {
					structureType: [STRUCTURE_SPAWN, STRUCTURE_CONTAINER, STRUCTURE_EXTENSION, STRUCTURE_STORAGE]
				}
			}).forEach(dst => {
				room.memory.mining.destinations[i] = dst.id
				i++
			});
		}

	},

	/** @param {Room} room */
	updateRoom: function(room) {
		for()
	},

	/** @param {Creep} creep */
	assignMiningSource: function(creep) {
		var src = room.memory.mining.sources[room.memory.mining.srcIndex];
		room.memory.mining.srcIndex++;
		if(room.mining.srcIndex >= room.mining.sources.length) {
			room.mining.srcIndex = 0;
		}

		return src;
	},

	/** @param {Creep} creep */
	assignMiningDestination: function(creep) {
		var dst = room.memory.mining.destinations[room.memory.mining.dstIndex];
		room.memory.mining.dstIndex++;
		if(room.mining.dstIndex >= room.mining.destinations.length) {
			room.mining.dstIndex = 0;
		}

		return dst;
	}
};

module.exports = operationsDirector;
