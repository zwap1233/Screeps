//		roleMiner.js
// Created on:	20/04/2020
// Author:		Wouter Schoenmakers
// email:		woutereldar@gmail.com

var operationsDirector = require('operations/operationsDirector');

var roleMiner = {

	MINING: 'mining',
	TRANSFERING: 'transfering',

	/** @param {Creep} creep */
	updateCreep: function(creep) {
		let src = Game.getObjectById(creep.memory.source);
		let dst = Game.getObjectById(creep.memory.destination);

		//If source is empty or null get new source from director
		if(src == null) {
			src = operationsDirector.assignMiningSource(creep);
			creep.memory.source = src.id;
		} else if(src.store[RESOURCE_ENERGY] == 0) {
			src = operationsDirector.assignMiningSource(creep);
			creep.memory.source = src.id;
		}

		//If destination is full or null get new destination from director
		if(dst = null) {
			dst = operationsDirector.assignMiningDestination(creep);
			creep.memory.destination = dst.id;
		} else if(dst.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
			dst = operationsDirector.assignMiningDestination(creep);
			creep.memory.destination = dst.id;
		}

		if(creep.memory.status === this.MINING) {
			if(creep.store.getFreeCapacity(RESOURCE_ENERGY) >= 2) {
				if(creep.harvest(src) === ERR_NOT_IN_RANGE) {
					creep.moveTo(src, {
						visualizePathStyle: {
							stroke: '#ffaa00'
						}
					});
				}
			} else {
				creep.memory.status = this.TRANSFERING;
			}
		}

		if(creep.memory.status === this.TRANSFERING) {
			if(creep.store[RESOURCE_ENERGY] > 0) {
				if(creep.transfer(dst, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
					creep.moveTo(dst, {
						visualizePathStyle: {
							stroke: '#32ba35'
						}
					})
				}
			} else {
				creep.memory.status = this.MINING;
			}
		}

	}
};

module.exports = roleMiner;
