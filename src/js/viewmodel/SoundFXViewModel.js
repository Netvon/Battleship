export default class SoundFXViewModel {
    /**
     *
     * @param source {string}
     * @param loop {boolean}
     */
    constructor(source, loop = false) {
        this.source = source;
        this.loop = loop;

        this._element = document.createElement('audio');
        this._element.src = this.source;
        this._element.loop = this.loop;
    }

    play() {
        this._element.play();
    }

    pause() {
        this._element.pause();
    }

    stop() {
        this._element.currentTime = 0;
        this._element.pause();
    }

    /**
     *
     * @param callback {function}
     */
    onEnded(callback) {
        this._element.addEventListener('ended', callback);
    }
}