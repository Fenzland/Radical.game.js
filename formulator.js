import units from './formulae/units.js';
import horizontal from './formulae/horizontal.js';
import vertical from './formulae/vertical.js';

export function randomUnit()
{
	return units[Math.floor( units.length*Math.random(), )];
}

export function mergeHorizontal( ...args )
{
	let set= horizontal;
	
	for( let arg of args )
		if( set[arg] )
			set= set[arg];
		else
			return null;
	
	if( set.$ )
		return set.$;
	else
		return null;
}

export function mergeVertical( ...args )
{
	let set= vertical;
	
	for( let arg of args )
		if( set[arg] )
			set= set[arg];
		else
			return null;
	
	if( set.$ )
		return set.$;
	else
		return null;
}

