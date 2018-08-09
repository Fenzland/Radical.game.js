import 'https://ovo.fenzland.com/init.js';
import View from 'https://ovo.fenzland.com/OvO/view/View.js';
import { If, ForEach, } from 'https://ovo.fenzland.com/OvO/view/Ctrl.js';
import HTML, { main, header, footer, aside, section, article, div, h1, h2, p, small, a, dialog, } from 'https://ovo.fenzland.com/OvO/view/HTML.js';
import Radical from '/radical.js';
import owo from 'https://assets.mallkd.com/owo.js/owo.js';

const view= new View( document.body, );
const radical= new Radical( 8, 10, );

owo.listen( 'KEY:ArrowLeft:0', ()=> radical.moveLeft(), );
owo.listen( 'KEY:ArrowRight:0', ()=> radical.moveRight(), );
owo.listen( 'KEY:ArrowDown:0', ()=> radical.drop(), );
owo.listen( 'KEY:ArrowUp:0', ()=> radical.hold(), );
owo.listen( 'KEY:Pause:0', ()=> radical.pause(), );
owo.listen( 'KEY: :0', ()=> radical.pause(), );

radical.start();

view.update(
	[
		header( 'header', ),
		main(
			section(
				radical.falling.character,
				{ style: { '--x':radical.falling.x, '--y':radical.falling.y, }, class: 'falling', },
			),
			ForEach( radical.map, ( col, x, )=> [
				ForEach( col, ( character, y, )=>[
					section(
						character,
						{ style: { '--x':x, '--y':y, }, },
					),
				], ),
			], ),
			If( radical.states.over, ).then( [
				dialog( 'Game Over', { class:'game-over', open:true, }, ),
			], ),
			If( radical.states.paused, ).then( [
				dialog( 'Paused', { class:'paused', open:true, }, ),
			], ),
		),
		aside(
			div(
				{ class:'hints', },
				div(
					p( '下一個字：', ),
					section( radical.states.next, ),
				),
				div(
					p( '手裏的字：', ),
					section( radical.states.holding, ),
				),
			),
		),
		footer( 'footer', ),
	],
)
