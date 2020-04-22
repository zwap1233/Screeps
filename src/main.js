//		main.js
// Created on:	18/04/2020
// Author:		Wouter Schoenmakers
// email:		woutereldar@gmail.com

const version = require('version');
const roomMayor = require('mayor/roomMayor');
var mayor1 = new roomMayor('mayor1');
var mayor2 = new roomMayor('mayor2');

module.exports.loop = function() {
	version.checkVersion();
	mayor1.run();
	mayor2.run();

	//console.log(Game.cpu.getUsed());
};
