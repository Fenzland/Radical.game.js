import Model from 'https://ovo.fenzland.com/OvO/model/Model.js';
import { map, } from 'https://ovo.fenzland.com/OvO/support/EnumerableObject.js';

export default class GameManager
{
	constructor( radical, storage, )
	{
		this.radical= radical;
		this.storage= storage;
		
		radical.makeUnit= this.unitMaker;
		radical.addEventListener( 'write', e=> this.write( e.character, ), );
		radical.addEventListener( 'round_over', e=> this.roundSettle(), );
		radical.addEventListener( 'game_over', e=> this.gameOver(), );
		
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
	
	store()
	{
		this.storage.store( {
			states: this.states.valueOf(),
			radical: this.radical.export(),
		}, );
	}
	
	loadFromStorage()
	{
		const data= this.storage.restore();
		
		if(!( data ))
			return;
		
		this.radical.import( data.radical, );
		map( data.states, ( key, value, )=> this.states[key]= value );
	}
	
	write( character, )
	{
		
	}
	
	roundSettle()
	{
		
	}
	
	gameOver()
	{
		
	}
	
	get unitMaker()
	{
		return ()=> this.level.units[Math.floor( this.level.unit_count*Math.random(), )];
	}
}
