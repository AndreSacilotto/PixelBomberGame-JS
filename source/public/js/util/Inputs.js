
export default class Input
{
    constructor(){
        //<String, InputKey>
        this.inputs = new Map();
        //document.addEventListener('keydown', (ev) => this.handleKeydown(ev));
        document.onkeydown = (ev) => this.handleKeydown(ev);
    }

    /** @param {string} keyName the funtion of key */
    /** @param {string} keyCode the keycode*/
    /** @param {string=} altKeyCode alternative keycode*/
    /** @param {function} func is alt key*/
    addInput(keyName, keyCode, altKeyCode, func){
        this.inputs.set(keyName, new InputKey(keyCode, altKeyCode, func))
    }

    /** @param {KeyboardEvent} event */
    handleKeydown(event) {
        const keyPressed = event.key;
        for (let [_, value] of this.inputs){
            if (value.verify(keyPressed))
                value.trigger();
        }
    }

    /** @param {string} keyRebind the funtion of key */
    /** @param {string} newKey the new key*/
    /** @param {boolean} isAlt is alt key*/
    reBindKey(keyRebind, newKey, isAlt){        
        if (isAlt)
            this.inputs.get(keyRebind).setAltKey(newKey);
        else
            this.inputs.get(keyRebind).setMainKey(newKey);
    }
}

class InputKey{
    /** @param {string} main */
    /** @param {string} [alt] */
    /** @param {function} func */
    constructor(main, alt, func)
    {
        this.main = main;
        this.alt = alt;
        this.func = func;
    }
    setMainKey(key){
        this.main = key;
    }
    setAltKey(key){
        this.alt = key;
    }
    verify(key){
        return key === this.main || key === this.alt;
    }
    trigger(){
        this.func();
    }
}