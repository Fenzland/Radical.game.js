import Model from 'https://ovo.fenzland.com/OvO/model/Model.js';

export default class GameManager
{
	constructor( radical, )
	{
		this.radical= radical;
		
		radical.makeUnit= this.unitMaker;
		
		this.states= new Model( {
			level: 0,
		}, );
	}
	
	async start()
	{
		await this.loadLevel();
		
		this.radical.start();
	}
	
	async loadLevel()
	{
		this.level= await import(`./levels/level_${this.states.level}.js`);
	}
	
	get unitMaker()
	{
		return ()=> this.level.units[Math.floor( this.level.unit_count*Math.random(), )];
	}
}
