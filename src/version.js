var version = {
	checkVersion: function() {
		if(!Memory.SCRIPT_VERSION || Memory.SCRIPT_VERSION != SCRIPT_VERSION) {
			Memory.SCRIPT_VERSION = SCRIPT_VERSION
			console.log('New code uploaded');
		}
	}
};

module.exports = version;
