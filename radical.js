import Model from 'https://ovo.fenzland.com/OvO/model/Model.js';
import { map, } from 'https://ovo.fenzland.com/OvO/support/EnumerableObject.js';
import { mergeHorizontal, mergeVertical, } from './formulator.js'

export default class Radical extends EventTarget
{
	constructor( colC, rowC, )
	{
		super();
		
		this.colC= colC;
		this.rowC= rowC;
		this.map= new Model( new Array( colC, ).fill( '', ).map( ()=> new Array( rowC, ).fill( '', ), ), );
		this.states= new Model( {
			next: '',
			holding: '',
			over: false,
			paused: false,
		}, );
		this.falling= new Model( { falling:false, x:0, y:-1, character:'', }, );
		this.spead= 4/100;
		this.dropWaiting= 500;
	}
	
	export()
	{
		return {
			colC: this.colC,
			rowC: this.rowC,
			map: this.map.valueOf(),
			states: this.states.valueOf(),
			falling: this.falling.valueOf(),
		};
	}
	
	import( script, )
	{
		if(!( this.colC===script.colC && this.rowC===script.rowC ))
			throw 'size not match.';
		
		script.map.forEach( ( col, x, )=> {
			col.forEach( ( character, y, )=> {
				this.map[x][y]= character;
			}, );
		}, );
		
		map( script.states, ( key, value, )=> this.states[key]= value );
		map( script.falling, ( key, value, )=> this.falling[key]= value );
	}
	
	makeUnit()
	{
		return '一';
	}
	
	async start()
	{
		this.states.next= this.makeUnit();
		
		while( true )
		{
			const startPoint= Math.floor( this.colC*Math.random(), );
			const character= this.states.next.valueOf();
			
			this.states.next= this.makeUnit();
			
			this.dispatchEvent( new Event( 'start', ), );
			
			if(!( await this.fall( character, startPoint, ) ))
				break;
			
		}
	}
	
	pause()
	{
		if( this.states.paused.valueOf() )
		{
			requestAnimationFrame( this.nextFrame, );
			
			this.states.paused= false;
		}
		else
			this.states.paused= true;
	}
	
	requestAnimationFrame( callback, )
	{
		if( this.states.paused.valueOf() )
			this.nextFrame= callback;
		else
			requestAnimationFrame( callback, );
	}
	
	fall( character, startPoint, )
	{
		this.falling.falling= true;
		this.falling.character= character;
		this.falling.x= startPoint;
		this.falling.y= -1;
		
		let falling= true;
		
		return new Promise( ( resolve, reject, )=> (f=> f( f, ))(
			f=> {
				this.falling.y-=- this.spead;
				
				const maxDepth= this.getMaxDepth( this.falling.x, );
				
				if( this.falling.y >= maxDepth )
				{
					this.falling.y= maxDepth;
					
					setTimeout( async ()=> {
						
						if( this.falling.y < this.getMaxDepth( this.falling.x, ) )
							return this.requestAnimationFrame( ()=> f( f, ), );
						
						falling= false;
						this.falling.falling= false;
						
						const result= await this.fill( this.falling.x.valueOf(), this.falling.y.valueOf(), this.falling.character.valueOf(), );
						
						this.dispatchEvent( new Event( 'round_over', ), )
						
						this.falling.x= 0;
						this.falling.y= -1;
						
						resolve( result, );
						
					}, this.dropWaiting, );
					
				}
				else
					return this.requestAnimationFrame( ()=> f( f, ), );
			},
		), );
	}
	
	getMaxDepth( x, )
	{
		for( let i= 0; i < this.rowC; ++i )
			if( this.map[x][i].valueOf() )
				return i - 1;
		
		return this.rowC - 1;
	}
	
	moveLeft()
	{
		if( this.states.paused.valueOf() )
			return;
		
		if(!( this.falling.falling.valueOf() ))
			return;
		
		if( this.falling.x <= 0 )
			return;
		
		if( this.falling.y > this.getMaxDepth( this.falling.x - 1, ) )
			return;
		
		this.falling.x-= 1;
	}
	
	moveRight()
	{
		if( this.states.paused.valueOf() )
			return;
		
		if(!( this.falling.falling.valueOf() ))
			return;
		
		if( this.falling.x >= this.colC - 1 )
			return;
		
		if( this.falling.y > this.getMaxDepth( this.falling.x - - 1, ) )
			return;
		
		this.falling.x-=- 1;
	}
	
	drop()
	{
		if( this.states.paused.valueOf() )
			return;
		
		if(!( this.falling.falling ))
			return;
		
		this.falling.y= this.getMaxDepth( this.falling.x, );
	}
	
	hold()
	{
		if( this.states.paused.valueOf() )
			return;
		
		const holding= this.states.holding.valueOf();
		
		if( holding )
		{
			this.states.holding= this.falling.character.valueOf();
			this.falling.character= holding;
		}
		else
		{
			this.states.holding= this.falling.character.valueOf();
			this.falling.character= this.states.next.valueOf();
			this.states.next= this.makeUnit();
		}
	}
	
	async fill( x, y, character, )
	{
		if( y <= 0 )
		{
			this.map[x][y]= character;
			
			return this.gameOver();
		}
		
		const mergers= [];
		
		if( character )
		{
			this.dispatchEvent( new WriteEvent( character, ), );
			
			// merge to Left
			if( x > 0 )
			{
				const merged= mergeHorizontal( this.map[x - 1][y].valueOf(), character, );
				
				if( merged )
					mergers.push( this.fill( x - 1, y, merged, ), );
			}
			
			// merge to Right
			if( x < this.colC - 1 )
			{
				const merged= mergeHorizontal( character, this.map[x - - 1][y].valueOf(), );
				
				if( merged )
					mergers.push( this.fill( x - - 1, y, merged, ), );
			}
			
			// merge to Below
			if( y <= this.colC )
			{
				const merged= mergeVertical( character, this.map[x][y - - 1].valueOf(), );
				
				if( merged )
					mergers.push( this.fill( x, y - - 1, merged, ), );
			}
		}
		
		if( mergers.length )
			this.map[x][y]= '';
		else
			this.map[x][y]= character;
		
		await Promise.all( mergers, );
		
		// merge from Above
		if( y > 1 && character )
		{
			const merged= mergeVertical( this.map[x][y - 1].valueOf(), character, );
			
			if( merged )
				await Promise.all( [
					this.fill( x, y, merged, ),
					this.fill( x, y - 1, '', )
				], );
		}
		
		// If emptied, above fall down.
		if(  y > 0 && !this.map[x][y].valueOf() )
		{
			const above= this.map[x][y - 1].valueOf();
			
			if( above )
			{
				await this.fill( x, y, above, );
				await this.fill( x, y - 1, '', );
			}
		}
		
		return true;
	}
	
	gameOver()
	{
		this.dispatchEvent( new Event( 'game_over', ), );
		
		this.states.over= true;
		
		return false;
	}
}

class WriteEvent extends Event
{
	constructor( character, )
	{
		super( 'write', ),
		
		Object.defineProperty( this, 'character', { value: character }, );
	}
}
