class Padoru {
		
	/*******************************
	 * Statics
	 * ****************************/
	static cmd = '/padoru'
	static max_time_limit_s = 1200;
	static animations = ['type1', 'type2', 'type3', 'type4'];
	static levels = [
		{ spawn_rate: 1000, spawn_limit: 6 },
		{ spawn_rate: 1000, spawn_limit: 10 },
	];
	static images = [
			// Yue
			'https://cdn.discordapp.com/emojis/655099097237422130.png',
			// Saber
			'https://cdn.discordapp.com/emojis/519149153746550785.png',
			// Chino
			'https://cdn.discordapp.com/attachments/375406879553093633/659064801217085498/chino-padoru.png',
			// Taiga
			'https://cdn.discordapp.com/attachments/466273613092225046/659068018696912906/taiga-padoru.png',
			// Miku
			'https://cdn.discordapp.com/attachments/518340427506647042/659073537809711104/miku-padoru.png',
			// Shizuru
			'https://cdn.discordapp.com/attachments/375406879553093633/659201454497595402/shiz_padoru2.png',
		];
	
	/*******************************
	 * Exposed Methods - need these for automation
	 * ****************************/
	constructor() {
		// Settings
		this.state = {
			is_on: false,
			level: Padoru.levels[0],
			timeout: null,
			container: document.createElement('div'),
		};

		// Add to page
		document.documentElement.appendChild(this.state.container);
	}
	
	disable() {
		this.state.is_on = false;
	}

	handle_cmd(msg_parts, otherArgs) { //must have otherArgs to support other args for other functions
		
		// parse msg
		const [level, time_limit_s] = this._parse(msg_parts)
		
		// Update the currently used lvl
		let level_index = level - 1;
		if (level_index < 0 || level_index > Padoru.levels.length)	{ level_index = 0; }
		this.state.level = Padoru.levels[level_index];

		// Disable padoru after the timeout. If there is already one, reset the timer
		if (this.state.timeout)		{ clearTimeout(this.state.timeout); }
		this.state.timeout = setTimeout(Padoru._disable.bind(null, this.state), time_limit_s * 1000);

		// Only start the padoru animation if it is not already started
		if (this.state.is_on)	{ return; }
		this.state.is_on = true;
		setTimeout(Padoru._timer.bind(null, this.state), this.state.level.spawn_rate) //starts
	}
	
	/*******************************
	 * Aux Functions
	 * ****************************/
	_parse(msg_parts) {
		
		// if off then disable
		if (msg_parts[1] === 'off') {
			this.disable();
			return;
		}

		// get level
		let level = parseInt(msg_parts[1] || '1', 10);
		if (isNaN(level) || level < 1)	{ level = 1; }

		// get timelimit
		let time_limit_s = parseInt(msg_parts[2] || '1200', 10);
		if (isNaN(time_limit_s) || time_limit_s < 1)	{ time_limit_s = 10; }
		time_limit_s = Math.min(time_limit_s, Padoru.max_time_limit_s)
		
		return [level, time_limit_s]
	}
	
	/*******************************
	 * Timer Functions
	 * ****************************/
	static _disable(state)	{state.is_on = false;}

	static _timer(state) {
		if (!state.is_on)	{ return; }

		// find num padoru for this timer instance
		const max_padoru = state.level.spawn_limit;
		const total = Math.floor(1 + Math.random() * (max_padoru - 1));
		
		// create that many padorus, then do timer again
		for (let i = 0; i < total; i++)	{ Padoru._create(state); }
		setTimeout(Padoru._timer.bind(null, state), state.level.spawn_rate);
	}
	static _create(state) {
		if (!state.is_on) { return; }

		const image = CustomTextTriggers.randomElement(Padoru.images);
		const animation_type = CustomTextTriggers.randomElement(Padoru.animations);
		const random_percent = (Math.random() * 100).toFixed(4);

		const outer = document.createElement('div');
		outer.classList.add('c-effect__padoru-outer');
		outer.classList.add(animation_type);
		outer.style.left = `${random_percent}%`;

		const shake_container = document.createElement('div');
		shake_container.classList.add('c-effect__padoru-shake');

		const inner = document.createElement('img');
		inner.classList.add('c-effect__padoru');
		inner.src = image;

		shake_container.appendChild(inner);
		outer.appendChild(shake_container);
		state.container.appendChild(outer)
		const fn = () => {
			outer.parentElement.removeChild(outer);
			outer.removeEventListener('animationend', fn);
		};
		outer.addEventListener('animationend', fn);
	}
}


class Snowflake {
	/*******************************
	 * Statics
	 * ****************************/
	static cmd = '/snow'
	static templates = ['❅', '❆'];
	static animations = ['type1', 'type2', 'type3', 'type4'];
	static max_time_limit_s = 1200;
	static levels = [
			{ spawn_rate: 250, spawn_limit: 10 },
			{ spawn_rate: 250, spawn_limit: 20 },
			{ spawn_rate: 150, spawn_limit: 20 },
			{ spawn_rate: 75, spawn_limit: 20 },
		];
	
	/*******************************
	 * Exposed Methods
	 * ****************************/
	constructor () {
		// settings
		this.state = {
			is_on: false,
			level: Snowflake.levels[0],
			timeout: null,
			container: document.createElement('div'),
		};

		// Add to page
		document.documentElement.appendChild(this.state.container);
	}

	disable() {
		this.state.is_on = false;
	}

	handle_cmd(msg_parts, otherArgs) {
		// parse msg
		let x = 8;
		const [level, time_limit_s] = this._parse(msg_parts)
		
		let level_index = level - 1;
		if (level_index < 0 || level_index > Snowflake.levels.length)	{ level_index = 0; }
		this.state.level = Snowflake.levels[level_index];

		// Disable snow after the timeout. If there is already one, reset the timer
		if (this.state.timeout)		{ clearTimeout(this.state.timeout); }
		this.state.timeout = setTimeout(Snowflake._disable.bind(null, this.state), time_limit_s * 1000);

		// Only start the snow animation if it is not already started
		if (this.state.is_on)	{ return; }
		this.state.is_on = true;
		setTimeout(Snowflake._timer.bind(null, this.state), this.state.level.spawn_rate);
	}
	
	/*******************************
	 * Aux Methods
	 * ****************************/
	_parse(msg_parts) {
		if (msg_parts[1] === 'off') {
			this.disable();
			return;
		}

		let level = parseInt(msg_parts[1] || '1', 10);
		if (isNaN(level) || level < 1)	{ level = 1; }

		let time_limit_s = parseInt(msg_parts[2] || '1200', 10);
		if (isNaN(time_limit_s) || time_limit_s < 1) { time_limit_s = 10; }
		time_limit_s = Math.min (time_limit_s, Snowflake.max_time_limit_s);

		return [level, time_limit_s]
	}
	/*******************************
	 * Timer Methods
	 * ****************************/
	static _disable(state)	{state.is_on = false;}

	static _timer(state) {
		if (!state.is_on)	{ return; }

		// find num snowflakes for this timer instance
		const max_snowflakes = state.level.spawn_limit;
		const total = Math.floor(1 + Math.random() * (max_snowflakes - 1));
		
		// create that many padorus, then do timer again
		for (let i = 0; i < total; i++)	{ Snowflake._create(state); }
		setTimeout(Snowflake._timer.bind(null, state), state.level.spawn_rate);
	}

	static _create(state) {
		if (!state.is_on) { return; }

		const ascii = CustomTextTriggers.randomElement(Snowflake.templates);
		const animation_type = CustomTextTriggers.randomElement(Snowflake.animations);
		const random_percent = (Math.random() * 100).toFixed(4);

		const outer = document.createElement('div');
		outer.classList.add('c-effect__snowflake-outer');
		outer.style.left = `${random_percent}%`;

		const inner = document.createElement('div');
		inner.classList.add('c-effect__snowflake');
		inner.classList.add(animation_type);
		inner.textContent = ascii;

		outer.appendChild(inner);
		state.container.appendChild(outer);
		const fn = () => {
			outer.parentElement.removeChild(outer);
			outer.removeEventListener('animationend', fn);
		};
		outer.addEventListener('animationend', fn);
	}
}

class ErabeEffect {
	static cmd = '/erabe'
	static max_time_limit_s = 20;
	static max_spawn_count = 15;
	static max_poll_options = 10;
	
	/*******************************
	 * Exposed Methods - need these for automation
	 * ****************************/
	constructor (){
		
		this.state = {
			is_on: false,
			timeout: null,
			container: document.createElement('div'),
		};

		document.documentElement.appendChild(this.state.container);
		
	}
	
	disable() {
		this.state.is_on = false;
		
		if (this.state.timeout) {
			clearTimeout(this.state.timeout);
		}
		this.state.timeout = null;
	}

	handle_cmd(msg_parts, otherArgs){
		
		let did_send_the_message = otherArgs[0];
		const [spawn_count, time_limit_s, total_poll_options] = this.parse(msg_parts);
		
		if (this.state.is_on) { return; }
		this.state.is_on = true;

		if (did_send_the_message) {
			try {
				const options = [];
				for (let i = 1; i <= total_poll_options; i++) {
					options.push(i.toString());
				}

				socket.emit('newPoll', {
					title:"ERABE",
					opts: options,
					obscured:false,
				});
			} catch (e) {}
		}

		for (let i = 0; i < spawn_count; i++) {
			this._createErabe();
		}

		// Remove all erabes after the timeout
		if (this.state.timeout) {
			clearTimeout(this.state.timeout);
		}
		this.state.timeout =
			setTimeout(this.disable, time_limit_s * 1000);	
	}

	/*******************************
	 * Aux Methods
	 * ****************************/
	_createErabe() {
		if (!this.state.is_on) { return; }

		// Build the erabe element
		const element = document.createElement('div');
		element.classList.add('c-effect_erabe', 'js-effect-erabe');
		element.textContent = 'erabe';

		// Randomizes the location of the erabe div
		const randomizePosition = () => {
			const [x, y] = ErabeEffect.getRandomErabePosition(
				element.offsetWidth,
				element.offsetHeight,
				50);

			element.style.left = `${x}px`;
			element.style.top = `${y}px`;
		};
		randomizePosition();

		const fn = () => {
			if (!this.state.is_on) {
				element.parentElement.removeChild(element);
				element.removeEventListener('animationiteration', fn);
				return;
			}

			randomizePosition();
		};
		element.addEventListener('animationiteration', fn);

		this.container.appendChild(element);
	}
	
	_parse(msg_parts) {
		if (msg_parts[1] === 'off') {
			this.disable();
			return;
		}

		let spawn_count = parseInt(msg_parts[1] || '2', 10);
		if (isNaN(spawn_count) || spawn_count < 1) { spawn_count = 2;}
		else if (spawn_count > this.max_spawn_count) { spawn_count = this.max_spawn_count; }

		let time_limit_s = parseInt(msg_parts[2] || '10', 10);
		if (isNaN(time_limit_s) || time_limit_s < 1) { time_limit_s = 10; }
		else if (time_limit_s > this.max_time_limit_s) { time_limit_s = this.max_time_limit_s; }

		let total_poll_options = parseInt(msg_parts[3] || '2', 10);
		if (isNaN(total_poll_options) || total_poll_options < 1) {
			total_poll_options = 2;
		} else if (total_poll_options > this.max_poll_options) {
			total_poll_options = this.max_poll_options;
		}

		return [spawn_count, time_limit_s, total_poll_options]
	}
	
	/*******************************
	 * Static Methods
	 * ****************************/
	static getRandomErabePosition(div_width, div_height, buffer) {
		const width = window.innerWidth - div_width;
		const height = window.innerHeight - div_height;

		const random_x = Math.floor(Math.random() * width);
		const random_y = Math.floor(Math.random() * height);
		return [random_x, random_y];
	}
	
}


class CustomTextTriggers {

	/*******************************
	 * Statics
	 * ****************************/
	// Add effects to custom effects array. This should be the only change to add something in
	static custom_effects = [Padoru, ErabeEffect, Snowflake]

	/*******************************
	 * Exposed Functions
	 * ****************************/
	constructor() {	
		// Init effects and setup the lookup dict
		this._effect_lookup = {}
		for (let effect of CustomTextTriggers.custom_effects) {
			let nEffect = new effect();
			this._effect_lookup[effect.cmd] = {effect: nEffect, handle: (x,y)=>{nEffect.handle_cmd(x,y)}};
		}
	
		// Add non-effect commands here
		this._effect_lookup['/effects_off'] = {effect: null, handle: (x,y)=>{this.disableEffects()}}
		
		// Testing
		this._effect_lookup['/effects_off'].handle('','')
		this._effect_lookup['/snow'].handle('','');
		this._effect_lookup['/effects_off'].handle('','')
	}


	disableEffects() {
		for (let effect in this._effect_lookup) {
			try	{this._effect_lookup[effect].disable();}
			catch (e) {}
		}
	}

	handleChatMessage(msg_data) {
		const is_shadowed = msg_data.username === CLIENT.name && msg_data.meta.shadow;
		if (msg_data.username === "[server]" || is_shadowed) {
			return;
		}

		if (!CustomTextTriggers.isMod(msg_data.username)) {
			return;
		}

		// If this client was the one who sent the message
		const did_send_the_message = CLIENT.name === msg_data.username;

		const msg_parts = msg_data.msg.trim().replace(/\s\s+/igm, ' ').split(' ');
		if (msg_parts.length <= 0 || !msg_parts[0] || msg_parts[0][0] !== '/') {
			return;
		}

		this._handlers[msg_parts[0]].handle_cmd(msg_parts, [did_send_the_message]);
	}
	
	/*******************************
	 * Static Methods
	 * ****************************/
	static isMod(username) {
		try {
			let is_mod = false;
			$("#userlist").find('span[class$=userlist_owner],span[class$=userlist_siteadmin]').each(function() {
				if ($(this).text() === username) {
					is_mod = true;
					return false;
				}
			});

			return is_mod;
		} catch (e) { return false; }
	}

	static isFirstMod() {
		const first_mod_element = $("#userlist").find('span[class$=userlist_owner],span[class$=userlist_siteadmin]').first();
		if (!first_mod_element) {
			return false;
		}

		return first_mod_element.text() === CLIENT.name;
	}
	
	static randomElement(array) {
		return array[Math.floor(Math.random() * array.length)];
	}

}
ctt = new CustomTextTriggers();

// This is what turns the whole thing on to be run by chat messages like /erabe
// TODO: Should we hide this behind a button being enabled? Like niconico is?
//socket.on("chatMsg", CustomTextTriggers.handleChatMessage);
