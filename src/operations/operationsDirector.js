//		operationsDirector.js
// Created on:	22/04/2020
// Author:		Wouter Schoenmakers
// email:		woutereldar@gmail.com

var roleMiner = require('operations/roleMiner');
var _ = require('lodash');

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
		//Maximum # of miners assigned to room
		if(!room.memory.maxMiners) {
			room.memory.maxMiners = 4;
		}

		//List of all assigned creeps
		if(!room.memory.creeps) {
			room.memory.creeps = [];
		}

		//setup mining related memory
		if(!room.memory.mining) {
			room.memory.mining = {};
		}

		//The director spreads the miners over multiple sources
		if(!room.memory.mining.srcIndex) {
			room.memory.mining.srcIndex = 0;
		}

		if(!room.memory.mining.sources) {
			room.memory.mining.sources = {};
		}

		let i = 0;
		const terrain = new Room.Terrain(room.name);
		room.find(FIND_SOURCES).forEach(src => {
			let x = src.pos.x;
			let y = src.pos.y;
			let space = 0;
			for(let dx = -1; dx < 2; dx++) {
				for(let dy = -1; dy < 2; dy++) {
					if(dx != 0 || dy != 0) {
						if(terrain.get(x + dx, y + dy) == 0) {
							space++;
						}
					}
				}
			}
			room.memory.mining.sources[i] = {
				id: src.id,
				maxMiners: space,
				miners: 0
			};

			i++;
		});

		if(!room.memory.mining.dstIndex) {
			room.memory.mining.dstIndex = 0;
		}

		if(!room.memory.mining.destinations) {
			room.memory.mining.destinations = [];
		}

		i = 0;
		room.find(FIND_MY_STRUCTURES, {
			filter: function(object) {
				return (object.structureType == STRUCTURE_SPAWN || object.structureType == STRUCTURE_CONTAINER || object.structureType == STRUCTURE_EXTENSION || object.structureType == STRUCTURE_STORAGE);
			}
		}).forEach(dst => {
			room.memory.mining.destinations[i] = dst.id
			i++
		});
	},

	/** @param {Room} room */
	updateRoom: function(room) {
		if(Object.keys(Game.creeps).length < room.memory.maxMiners) {
			this.spawnCreep(room, Director.OPERATIONS, CreepRole.MINER);
		}

		//find better way of finding assigned creeps
		room.memory.creeps.forEach(name => {
			if(!Game.creeps[name]) {
				delete room.memory.creeps[name];
			} else {
				roleMiner.updateCreep(Game.creeps[name], this);
			}
		});
	},

	/**
	 * 
	 * @param {Room} room 
	 * @param {Director} director 
	 * @param {CreepRole} role 
	 */
	spawnCreep: function(room, director, role) {
		let spawn = room.find(FIND_MY_SPAWNS)[0];
		let name = director + '_' + Game.time;
		let res = spawn.spawnCreep([
			WORK,
			MOVE,
			CARRY
		], name, {
			memory: {
				role: role,
				director: director,
				room: room.name
			}
		});

		if(res == OK) {
			room.memory.creeps.push(name);
		}

		return res;
	},

	/** @param {Creep} creep */
	assignMiningSource: function(creep) {
		let room = Game.rooms[creep.memory.room];

		let dst = Game.getObjectById(creep.memory.destination);;
		if(dst === null) {
			dst = this.assignMiningDestination(creep);
		}

		let goals = _.map(_.filter(room.memory.mining.sources, function(o) {
			return o.miners < o.maxMiners;
		}), function(o) {
			return Game.getObjectById(o.id);
		});

		let src = dst.pos.findClosestByPath(goals);
		_.find(room.memory.mining.sources, {
			id: src.id
		}).miners++;

		return src;
	},

	/** @param {Creep} creep */
	assignMiningDestination: function(creep) {
		let room = Game.rooms[creep.memory.room];
		let dst_id = room.memory.mining.destinations[room.memory.mining.dstIndex];

		room.memory.mining.dstIndex++;
		if(room.memory.mining.dstIndex >= room.memory.mining.destinations.length) {
			room.memory.mining.dstIndex = 0;
		}

		return Game.getObjectById(dst_id);
	}
};

module.exports = operationsDirector;
