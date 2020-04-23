//		operationsDirector.js
// Created on:	22/04/2020
// Author:		Wouter Schoenmakers
// email:		woutereldar@gmail.com

var roleMiner = require('operations/roleMiner');

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
		if(!room.memory.maxMiners) {
			room.memory.maxMiners = 4;
		}

		if(!room.memory.mining) {
			room.memory.mining = {};
		}

		if(!room.memory.mining.srcIndex) {
			room.memory.mining.srcIndex = 0;
		}

		if(!room.memory.mining.sources) {
			room.memory.mining.sources = [];
		}

		var i = 0;
		room.find(FIND_SOURCES).forEach(src => {
			room.memory.mining.sources[i] = src.id;
			i++;
		});

		if(!room.memory.mining.dstIndex) {
			room.memory.mining.dstIndex = 0;
		}

		if(!room.memory.mining.destinations) {
			room.memory.mining.destinations = [];
		}

		var i = 0;
		room.find(FIND_MY_STRUCTURES, {
			filter: function(object) {
				return (object.structureType == STRUCTURE_SPAWN || object.structureType == STRUCTURE_CONTAINER || object.structureType == STRUCTURE_EXTENSION || object.structureType == STRUCTURE_STORAGE);
			}
		}).forEach(dst => {
			room.memory.mining.destinations[i] = dst.id
			i++
		});

		for(const name in Game.creeps) {
			roleMiner.initCreep(Game.creeps[name], 'operations', room);
		}
	},

	/** @param {Room} room */
	updateRoom: function(room) {
		for(const name in Game.creeps) {
			roleMiner.updateCreep(Game.creeps[name], this);
		}
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
