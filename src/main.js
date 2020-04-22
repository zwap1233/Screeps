//		main.js
// Created on:	18/04/2020
// Author:		Wouter Schoenmakers
// email:		woutereldar@gmail.com

const version = require('version');
const operationsDirector = require('operations/operationsDirector');

module.exports.loop = function() {
	if(version.checkVersion()) {
		operationsDirector.init();
	}

	operationsDirector.update();

	//console.log(Game.cpu.getUsed());
};
