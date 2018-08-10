
export default {
	
	store( data, channel='default', )
	{
		localStorage.setItem( `Radical<${channel}>`, JSON.stringify( data, ), );
	},
	
	restore( channel='default', )
	{
		return JSON.parse( localStorage.getItem( `Radical<${channel}>`, )||'null', );
	},
};
