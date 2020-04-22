//		main.js
// Created on:	18/04/2020
// Author:		Wouter Schoenmakers
// email:		woutereldar@gmail.com

const version = require('version');
const roomMayor = require('mayor/roomMayor');

module.exports.loop = function() {
	version.checkVersion();

	//console.log(Game.cpu.getUsed());
};
