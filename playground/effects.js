class PresentsEffect {
    static command = '/presents';
    static shiz_img = 'https://cdn.discordapp.com/attachments/375406879553093633/659201454497595402/shiz_padoru2.png';
    static presents_duration_s = 20;
    static present_animations = ['type1', 'type2', 'type3', 'type4'];
    static levels = [
        { spawn_rate: 1000, spawn_limit: 6 },
        { spawn_rate: 1000, spawn_limit: 10 },
    ];

    static versions = {
        'normal': {
            padoru: PresentsEffect.shiz_img,
            img_bank: [
                'https://cdn.discordapp.com/attachments/162409148909223936/781038166915547136/sample_64688cb11e7f37d58eca70a6709e4ceb.jpg',
                'https://cdn.discordapp.com/attachments/162409148909223936/780983025059627089/Efr2CGlVAAAk5_X.png',
                'https://cdn.discordapp.com/attachments/162409148909223936/780961390239678504/85881312_p0_master1200.jpg',
                'https://cdn.discordapp.com/attachments/483446980605902848/781295276778323988/1363841058659.gif'
            ]
        },
    }
    ///////////////////////////////////////////
    // "Public" Static methods
    ///////////////////////////////////////////
    static init() {
        PresentsEffect.state = {
            is_on: false,
            timeout: null,
            level: PresentsEffect.levels[0],
            version: PresentsEffect.versions['normal'],
        }
        PresentsEffect.container = document.createElement('div');
        document.documentElement.appendChild(PresentsEffect.container);
    }

    static disable() {
        PresentsEffect.state.is_on = false;
    }

    static addElement(element) {
        PresentsEffect.container.appendChild(element);
    }

    static handleCommand(message_parts, otherArgs) {
        
        // No parse, right now just one version
        // TODO: add different H levels and loli options

        // Disable presents after the timeout. If there is already one, reset the timer
        if (PresentsEffect.state.timeout) {
            clearTimeout(PresentsEffect.state.timeout);
        }
        PresentsEffect.state.timeout =
            setTimeout(PresentsEffect.disable, PresentsEffect.presents_duration_s * 1000);
        
        // Only start the padoru animation if it is not already started
        if (PresentsEffect.state.is_on) {
            return;
        }
        PresentsEffect.state.is_on = true;
        PresentsEffect._face_animation();
        PresentsEffect._run_presents_animation();
    }
    ///////////////////////////////////////////
    // Timed Static methods
    ///////////////////////////////////////////
    static _face_animation(){
        if (!PresentsEffect.state.is_on) {
            return;
        }
        const faceImg = PresentsEffect.state.version.padoru;

        const faceEffect = document.createElement('img')
        faceEffect.classList.add('c-effect__presents-face');
        faceEffect.src = faceImg;
        PresentsEffect.addElement(faceEffect);

        const fn = () =>{
            faceEffect.parentElement.removeChild(faceEffect);
            faceEffect.removeEventListener('animationend', fn);
        }
        faceEffect.addEventListener('animationend', fn);
    }

    static _run_presents_animation() {
        const create_fn = (isLeft) => {
            if (!PresentsEffect.state.is_on) {
                return;
            }
            
            PresentsEffect._create_present(isLeft);
            setTimeout(create_fn.bind(null,!isLeft), PresentsEffect.state.level.spawn_rate);
        };
        setTimeout(create_fn.bind(null, true), PresentsEffect.state.level.spawn_rate);
    }
    static _create_present(isLeft){
        if (!PresentsEffect.state.is_on) {
            return;
        }
        
        //const presentImg = PresentsEffect.shiz_img; // replace with random
        const presentImg = CustomTextTriggers.randomElement(PresentsEffect.state.version.img_bank);
        const animation = CustomTextTriggers.randomElement(PresentsEffect.present_animations);
       
        let offset = -500;
        if (isLeft)     { offset = 10; }
        else            { offset = 55; }
        let random_location = (Math.random() * 35+ offset).toFixed(4);
        
        const inner = document.createElement('img')
        inner.classList.add('c-effect__presents-present-fall-'.concat(animation));
        //inner.classList.add(animation);
        inner.style.left = `${random_location}%`; 
        inner.src = presentImg;
        PresentsEffect.addElement(inner);
        
        const fn = () => {
            inner.parentElement.removeChild(inner);
            inner.removeEventListener('animationend', fn);
        };
        inner.addEventListener('animationend', fn);
    }
}
class PadoruEffect {
    ///////////////////////////////////////////
    // Static variables
    ///////////////////////////////////////////
    static command = '/padoru';
    static animations = ['type1', 'type2', 'type3', 'type4'];
    static max_padoru_time_limit_s = 1200;
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

    ///////////////////////////////////////////
    // "Public" Static methods
    ///////////////////////////////////////////
    static init() {
        PadoruEffect.state = {
            is_on: false,
            level_info: PadoruEffect.levels[0],
            timeout: null,
        };
        PadoruEffect.container = document.createElement('div');
        document.documentElement.appendChild(PadoruEffect.container);
    }

    static disable() {
        PadoruEffect.state.is_on = false;
    }

    static addElement(element) {
        PadoruEffect.container.appendChild(element);
    }

    static handleCommand(message_parts, otherArgs) { // for compatibility

        let [level, time_limit_s] = PadoruEffect.parseMessage(message_parts)

        // Update the currently used snowing level
        let level_index = level - 1;
        if (level_index < 0 || level_index > PadoruEffect.levels.length) {
            level_index = 0;
        }
        PadoruEffect.state.level_info = PadoruEffect.levels[level_index];

        // Disable padoru after the timeout. If there is already one, reset the timer
        if (PadoruEffect.state.timeout) {
            clearTimeout(PadoruEffect.state.timeout);
        }
        PadoruEffect.state.timeout =
            setTimeout(PadoruEffect.disable, time_limit_s * 1000);

        // Only start the padoru animation if it is not already started
        if (PadoruEffect.state.is_on) {
            return;
        }
        PadoruEffect.state.is_on = true;
        PadoruEffect._runAnimation();
    }

    static parseMessage (message_parts){
        if (message_parts[1] === 'off') {
            PadoruEffect.disable();
            return;
        }

        let level = parseInt(message_parts[1] || '1', 10);
        if (isNaN(level) || level < 1) {
            level = 1;
        }

        let time_limit_s = parseInt(message_parts[2] || '1200', 10);
        if (isNaN(time_limit_s) || time_limit_s < 1) {
            time_limit_s = 10;
        } else if (time_limit_s > PadoruEffect.max_time_limit_s) {
            time_limit_s = PadoruEffect.max_time_limit_s;
        }
        return [level, time_limit_s]
    }

    ///////////////////////////////////////////
    // "Timer" Static methods
    ///////////////////////////////////////////
    static createPadoru() {
        if (!PadoruEffect.state.is_on) {
            return;
        }

        const padoru_image = CustomTextTriggers.randomElement(PadoruEffect.images);
        const animation_type = CustomTextTriggers.randomElement(PadoruEffect.animations);
        const random_percent = (Math.random() * 100).toFixed(4);

        const outer = document.createElement('div');
        outer.classList.add('c-effect__padoru-outer');
        outer.classList.add(animation_type);
        outer.style.left = `${random_percent}%`;

        const shake_container = document.createElement('div');
        shake_container.classList.add('c-effect__padoru-shake');

        const inner = document.createElement('img');
        inner.classList.add('c-effect__padoru');
        inner.src = padoru_image;

        shake_container.appendChild(inner);
        outer.appendChild(shake_container);
        PadoruEffect.addElement(outer);
        const fn = () => {
            outer.parentElement.removeChild(outer);
            outer.removeEventListener('animationend', fn);
        };
        outer.addEventListener('animationend', fn);
    }

    static _runAnimation() {
        const create_fn = () => {
            if (!PadoruEffect.state.is_on) {
                return;
            }

            const max_padoru = PadoruEffect.state.level_info.spawn_limit;
            const total = Math.floor(1 + Math.random() * (max_padoru - 1));
            for (let i = 0; i < total; i++) {
                PadoruEffect.createPadoru();
            }

            setTimeout(create_fn, PadoruEffect.state.level_info.spawn_rate);
        };
        setTimeout(create_fn, PadoruEffect.state.level_info.spawn_rate);
    }

}

class SnowEffect {
    ///////////////////////////////////////////
    // Static variables
    ///////////////////////////////////////////
    static command = '/snow';
    static templates = ['❅', '❆'];
    static animations = ['type1', 'type2', 'type3', 'type4'];
    static levels = [
        { spawn_rate: 250, spawn_limit: 10 },
        { spawn_rate: 250, spawn_limit: 20 },
        { spawn_rate: 150, spawn_limit: 20 },
        { spawn_rate: 75, spawn_limit: 20 },
    ];
    static max_time_limit_s = 1200;

    ///////////////////////////////////////////
    // "Public" Static methods
    ///////////////////////////////////////////
    static init() {
        SnowEffect.state = {
            is_on: false,
            level_info: SnowEffect.levels[0],
            timeout: null,
        }
        SnowEffect.container = document.createElement('div');
        document.documentElement.appendChild(SnowEffect.container);
    }
    static disable() {
        SnowEffect.state.is_on = false;
    }
    static handleCommand(message_parts, otherArgs) { // other args is for compatability

        let [level, time_limit_s] = SnowEffect.parseMessage(message_parts);

        // Update the currently used snowing level
        let level_index = level - 1;
        if (level_index < 0 || level_index > SnowEffect.levels.length) {
            level_index = 0;
        }
        SnowEffect.state.level_info = SnowEffect.levels[level_index];

        // Disable snow after the timeout. If there is already one, reset the timer
        if (SnowEffect.state.timeout) {
            clearTimeout(SnowEffect.state.timeout);
        }
        SnowEffect.state.timeout =
            setTimeout(SnowEffect.disable, time_limit_s * 1000);

        // Only start the snow animation if it is not already started
        if (SnowEffect.state.is_on) {
            return;
        }
        SnowEffect.state.is_on = true;
        SnowEffect._runAnimation();
    }
    static addElement(element) {
        SnowEffect.container.appendChild(element);
    }

    static parseMessage(message_parts) {
        if (message_parts[1] === 'off') {
            SnowEffect.disable();
            return;
        }

        let level = parseInt(message_parts[1] || '1', 10);
        if (isNaN(level) || level < 1) {
            level = 1;
        }

        let time_limit_s = parseInt(message_parts[2] || '1200', 10);
        if (isNaN(time_limit_s) || time_limit_s < 1) {
            time_limit_s = 10;
        } else if (time_limit_s > SnowEffect.max_time_limit_s) {
            time_limit_s = SnowEffect.max_time_limit_s;
        }

        return [level, time_limit_s];

    }

    ///////////////////////////////////////////
    // "Timer" Static methods
    ///////////////////////////////////////////
    static createSnowflake() {
        if (!SnowEffect.state.is_on) {
            return;
        }

        const ascii = CustomTextTriggers.randomElement(SnowEffect.templates);
        const animation_type = CustomTextTriggers.randomElement(SnowEffect.animations);
        const random_percent = (Math.random() * 100).toFixed(4);

        const outer = document.createElement('div');
        outer.classList.add('c-effect__snowflake-outer');
        outer.style.left = `${random_percent}%`;

        const inner = document.createElement('div');
        inner.classList.add('c-effect__snowflake');
        inner.classList.add(animation_type);
        inner.textContent = ascii;

        outer.appendChild(inner);
        SnowEffect.addElement(outer);
        const fn = () => {
            outer.parentElement.removeChild(outer);
            outer.removeEventListener('animationend', fn);
        };
        outer.addEventListener('animationend', fn);
    }

    static _runAnimation() {
        const create_fn = () => {
            if (!SnowEffect.state.is_on) {
                return;
            }

            const max_snowflakes = SnowEffect.state.level_info.spawn_limit;
            const total = Math.floor(1 + Math.random() * (max_snowflakes - 1));
            for (let i = 0; i < total; i++) {
                SnowEffect.createSnowflake();
            }

            setTimeout(create_fn, SnowEffect.state.level_info.spawn_rate);
        };
        setTimeout(create_fn, SnowEffect.state.level_info.spawn_rate);
    }
}

class ErabeEffect {

    ///////////////////////////////////////////
    // Static variables
    /////////////////////////////////////////// 
    static command = '/erabe';
    static max_time_limit_s = 20;
    static max_spawn_count = 15;
    static max_poll_options = 10;

    ///////////////////////////////////////////
    // "Public" Static methods
    ///////////////////////////////////////////
    static init() {
        ErabeEffect.state = {
            is_on: false,
            timeout: null,
        }
        ErabeEffect.container = document.createElement('div');
        document.documentElement.appendChild(ErabeEffect.container);
    };
    static addElement(element) {
        ErabeEffect.container.appendChild(element);
    }
    static handleCommand(message_parts, did_send_the_message){

        let [spawn_count, time_limit_s, total_erabe_poll_options] =
            ErabeEffect.parseMessage(message_parts);

        if (ErabeEffect.is_on) {
            return;
        }
        ErabeEffect.is_on = true;

        if (did_send_the_message) {
            try {
                const options = [];
                for (let i = 1; i <= total_erabe_poll_options; i++) {
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
            ErabeEffect.createErabe();
        }

        // Remove all erabes after the timeout
        if (ErabeEffect.state.timeout) {
            clearTimeout(ErabeEffect.state.timeout);
        }
        ErabeEffect.state.timeout =
            setTimeout(ErabeEffect.disable, time_limit_s * 1000);
    }
    static disable() {
        ErabeEffect.is_on = false;
        if (ErabeEffect.state.timeout) {
            clearTimeout(ErabeEffect.state.timeout);
        }

        ErabeEffect.state.timeout = null;
    }

    ///////////////////////////////////////////
    // "Private" Static methods
    ///////////////////////////////////////////
    static parseMessage(message_parts) {
        if (message_parts[1] === 'off') {
            CustomTextTriggers.disableErabe();
            return;
        }

        let spawn_count = parseInt(message_parts[1] || '2', 10);
        if (isNaN(spawn_count) || spawn_count < 1) {
            spawn_count = 2;
        } else if (spawn_count > ErabeEffect.max_spawn_count) {
            spawn_count = ErabeEffect.max_spawn_count;
        }

        let time_limit_s = parseInt(message_parts[2] || '10', 10);
        if (isNaN(time_limit_s) || time_limit_s < 1) {
            time_limit_s = 10;
        } else if (time_limit_s > ErabeEffect.max_time_limit_s) {
            time_limit_s = ErabeEffect.max_time_limit_s;
        }

        let total_erabe_poll_options = parseInt(message_parts[3] || '2', 10);
        if (isNaN(total_erabe_poll_options) || total_erabe_poll_options < 1) {
            total_erabe_poll_options = 2;
        } else if (total_erabe_poll_options > ErabeEffect.max_poll_options) {
            total_erabe_poll_options = ErabeEffect.max_poll_options;
        }
        return [spawn_count, time_limit_s, total_erabe_poll_options];
    }
    static createErabe() {
        if (!ErabeEffect.is_on) {
            return;
        }

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
            if (!ErabeEffect.is_on) {
                element.parentElement.removeChild(element);
                element.removeEventListener('animationiteration', fn);
                return;
            }

            randomizePosition();
        };
        element.addEventListener('animationiteration', fn);

        ErabeEffect.addElement(element);
    }
    static getRandomErabePosition(div_width, div_height, buffer) {
        const width = window.innerWidth - div_width;
        const height = window.innerHeight - div_height;

        const random_x = Math.floor(Math.random() * width);
        const random_y = Math.floor(Math.random() * height);
        return [random_x, random_y];
    }

}
class CustomTextTriggers {

    // Only place you need to add a new effect to make it work
    static effects = [ErabeEffect, SnowEffect, PadoruEffect, PresentsEffect];

    static init() {
        if (CustomTextTriggers.has_init) {
            return;
        }
        CustomTextTriggers.has_init = false;

        // Setup the effect lookup
        CustomTextTriggers.effect_lookup = {};
        for (let effectCls of CustomTextTriggers.effects) {
            effectCls.init();
            CustomTextTriggers.effect_lookup[effectCls.command] = {effect: effectCls, handle: effectCls.handleCommand};
        }

        // Add non-effect commands here
        CustomTextTriggers.effect_lookup['/effects_off'] = {effect: null, handle: CustomTextTriggers.disableEffects};

        // testing
        CustomTextTriggers.effect_lookup['/presents'].handle('', []);
        //CustomTextTriggers.effect_lookup['/padoru'].handle('', []);

    }

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

    /* Command handlers */
    static handleChatMessage(msg_data) {
        const is_shadowed = msg_data.username === CLIENT.name && msg_data.meta.shadow;
        if (msg_data.username === "[server]" || is_shadowed) {
            return;
        }

        if (!CustomTextTriggers.isMod(msg_data.username)) {
            return;
        }

        // If this client was the one who sent the message
        const did_send_the_message = CLIENT.name === msg_data.username;

        const message_parts = msg_data.msg.trim().replace(/\s\s+/igm, ' ').split(' ');
        if (message_parts.length <= 0 || !message_parts[0] || message_parts[0][0] !== '/') {
            return;
        }

        // Do the command if it exists
        try {
            CustomTextTriggers.effect_lookup[message_parts[0]].handle(message_parts, [did_send_the_message]);
        } catch (e) {}
    }

    static disableEffects() {
        for (let effect in CustomTextTriggers.effect_lookup) {
            try {
                CustomTextTriggers.effect_lookup[effect].disable();
            } catch (e) {}
        }
    }

}

CustomTextTriggers.init();

// This is what turns the whole thing on to be run by chat messages like /erabe
// TODO: Should we hide this behind a button being enabled? Like niconico is?
//socket.on("chatMsg", CustomTextTriggers.handleChatMessage);
