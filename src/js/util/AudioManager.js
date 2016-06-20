export default class AudioManager {

    static load(name, source) {
        if (this._audio === undefined)
            this._audio = new Map();

        let el = document.createElement('audio');
        el.src = source;
        el.volume = 0.5;
        this._audio.set(name, el);

        el.currentTime = 0;
    }

    static play(name, loop = false, removeAfterComplete = true, startAt = 0) {

        if (this._audio === undefined || !this._audio.has(name))
            this._audio = new Map();

        // console.dir(this._audio);

        let el = this._audio.get(name);

        if(removeAfterComplete)
            el.addEventListener('ended', () => this._audio.delete(name));

        el.loop = loop;
        el.currentTime = startAt;
        el.play();
    }

    static pause(name) {
        if (this._audio === undefined || !this._audio.has(name))
            return;

        this._audio.get(name).pause();
    }

    static stop(name) {
        if (this._audio === undefined || !this._audio.has(name))
            return;

        let audio = this._audio.get(name);

        audio.pause();
        audio.currentTime = 0;
    }
}