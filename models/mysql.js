//--- MySQL ---//

function mySql(){
	var mysql = require('mysql');

	// connect mysql data base 
	return mysql.createConnection({
		host: process.env.DB_HOST || 'localhost',
		user : 'mod1_user',
		password: process.env.DB_PASS || 'IRC2015',
		database: process.env.DB_NAME || 'mod1_DB'
	});
}

//--- End MySQL ---//

module.exports = mySql;