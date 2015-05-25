if(process.env.USER == 'isen'){
	var DbUrl = 'mongodb://localhost/dard';
	var SessionsUrl = 'mongodb://localhost/sessions';

}
else
{	
	var DbUrl = 'mongodb://dard:mc0T8D6u@ds037451.mongolab.com:37451/dard';
	var SessionsUrl = 'mongodb://dard:mc0T8D6u@ds039311.mongolab.com:39311/sessions';
}

  

module.exports = {
  'DbUrl' : DbUrl,
  'SessionsUrl': SessionsUrl

}