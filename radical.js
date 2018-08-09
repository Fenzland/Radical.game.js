import Model from 'https://ovo.fenzland.com/OvO/model/Model.js';
import { randomUnit, mergeHorizontal, mergeVertical, } from './repertory.js'

export default class Radical
{
	constructor( colC, rowC, )
	{
		this.colC= colC;
		this.rowC= rowC;
		this.map= new Model( new Array( colC, ).fill( '', ).map( ()=> new Array( rowC, ).fill( '', ), ), );
		this.falling= new Model( { falling:false, x:0, y:-1, character:'', }, );
		this.spead= 4/100;
		this.dropWaiting= 500;
	}
	
	async start()
	{
		
		while( true )
		{
			const startPoint= Math.floor( this.colC*Math.random(), );
			const character= randomUnit();
			
			await this.fall( character, startPoint, );
		}
	}
	
	async fall( character, startPoint, )
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
							return requestAnimationFrame( ()=> f( f, ), );
						
						falling= false;
						this.falling.falling= false;
						
						await this.fill( this.falling.x.valueOf(), this.falling.y.valueOf(), this.falling.character.valueOf(), );
						
						this.falling.x= 0;
						this.falling.y= -1;
						
						resolve();
						
					}, this.dropWaiting, );
					
				}
				else
					return requestAnimationFrame( ()=> f( f, ), );
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
		if(!( this.falling.falling ))
			return;
		
		this.falling.y= this.getMaxDepth( this.falling.x, );
	}
	
	async fill( x, y, character, )
	{
		const mergers= [];
		
		if( character )
		{
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
	}
}
