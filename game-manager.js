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
		
		window.addEventListener( 'beforeunload', e=> this.store(), )
		
		this.states= new Model( {
			level: 0,
			is_last_level: true,
			goals: [],
			level_title: '',
			level_comment: '',
		}, );
		
		this.loadFromStorage();
	}
	
	async start()
	{
		await this.loadLevel();
		
		this.radical.start();
	}
	
	async loadLevel()
	{
		this.level= await import(`./levels/level_${this.states.level}.js`);
		
		this.states.is_last_level= this.level.is_last_level;
		this.states.level_title= this.level.title;
		this.states.level_comment= this.level.comment;
		this.states.goals= this.level.goals.map( goal=> Object.assign( { made:false, }, goal, ), );
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
		this.states.goals.forEach( ( goal, i, )=> {
			if( goal.character.valueOf()===character )
				goal.made= true;
		}, );
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
