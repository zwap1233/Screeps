//		roomMayor.js
// Created on:	22/04/2020
// Author:		Wouter Schoenmakers
// email:		woutereldar@gmail.com

class roomMayor {
	/**
	 * @param {String} name 
	 */
	constructor(name) {
		this.name = name;
	}

	run() {
		console.log(this.name);
	}
}

module.exports = roomMayor;
