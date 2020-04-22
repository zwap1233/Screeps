var version = {
	/**
	 * Check if a new version has been uploaded, returns true if new code has been uploaded.
	 */
	checkVersion: function() {
		if(!Memory.SCRIPT_VERSION || Memory.SCRIPT_VERSION != SCRIPT_VERSION) {
			Memory.SCRIPT_VERSION = SCRIPT_VERSION
			console.log('New code uploaded');
			return true;
		}

		return false;
	}
};

module.exports = version;
