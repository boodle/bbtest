var config = {
	version: '0.3.81',																					// current version
    mode: 'app',                                                                                        // if this is running online, or in a compiled app
    dataFormatVersion: 2,																				// if the format the data is stored in changes from version to version, this can be used to ensure we load the right format for each version of the app
	pageTitleRoot: 'Say No Toolkit',
	animation: {
		interpageSpeed: 300
	},
	connection: {
		url: 'http://dev.saynotoolkit.net',																	// what domain to check for database updates
		connectionFailureCount: 0,																		// how many times have we failed to connect to the remote server this time round?
		connectionFailureLimit: 5,																		// how many are we allowed before we decide we're offline, despite what the device says?
		dataFormatVersion: 1																			// In case the data format is changed in the future, the app will look for /resources/[companyId].[dataFormatVersion].database.json
	},
	customization: {																					// which version of the database to look for etc
		companyId: 0,
		companyName: 'Institute of Business Ethics'
	}
};