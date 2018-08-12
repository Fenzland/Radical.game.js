import 'https://ovo.fenzland.com/init.js';
import View from 'https://ovo.fenzland.com/OvO/view/View.js';
import Listener from 'https://ovo.fenzland.com/OvO/view/Listener.js';
import { If, ForEach, } from 'https://ovo.fenzland.com/OvO/view/Ctrl.js';
import HTML, { main, header, footer, aside, section, article, div, button, h1, h2, p, small, a, dialog, } from 'https://ovo.fenzland.com/OvO/view/HTML.js';
import { $, } from 'https://ovo.fenzland.com/OvO/model/Model.js';
import Radical from '/radical.js';
import storage from '/storage.js';
import GameManager from '/game-manager.js';
import owo from 'https://assets.mallkd.com/owo.js/owo.js';

const view= new View( document.body, );
const radical= new Radical( 8, 10, );
const game_manager= new GameManager( radical, storage, );

owo.listen( 'KEY:ArrowLeft:0', ()=> radical.moveLeft(), );
owo.listen( 'KEY:ArrowRight:0', ()=> radical.moveRight(), );
owo.listen( 'KEY:ArrowDown:0', ()=> radical.drop(), );
owo.listen( 'KEY:ArrowUp:0', ()=> radical.hold(), );
owo.listen( 'KEY:Pause:0', ()=> radical.pause(), );
owo.listen( 'KEY: :0', ()=> radical.pause(), );

game_manager.start();

view.update(
	[
		header(
			'關卡：', game_manager.states.level,
			h1( game_manager.states.level_title, ),
			p( game_manager.states.level_comment, ),
		),
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
				dialog(
					{ class:'game-over', open:true, },
					p( 'Game Over', ),
					p( button( 'restart', new Listener( 'click', ()=> game_manager.restart(), ), ), ),
				),
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
			div(
				{ class:'goals', },
				header( '目標文字：', ),
				main(
					ForEach( game_manager.states.goals, goal=> [
						section(
							{ class:goal.made.$( x=> x?'':'placeholder', ), },
							$( ( made, character, placeholder, )=> made? character : placeholder, goal.made, goal.character, goal.placeholder, ),
						),
					], ),
				),
			),
		),
		footer( 'footer', ),
	],
)
