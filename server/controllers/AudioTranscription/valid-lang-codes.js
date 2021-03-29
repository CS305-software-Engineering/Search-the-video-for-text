const EngLangCodes = ['en-au', 'en-ca', 'en-gb', 'en-in', 'en-ie', 'en-nz', 'en-ph', 'en-za', 'en-us']

function isValidLang(lang){
   //return true if lang exists in englangcodes list
	return EngLangCodes.indexOf(lang.toLowerCase()) > -1;

	}

module.exports = {
	check : isLanguageValid,
	list : validLanguageCodes
};