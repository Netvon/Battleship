export default class ViewModel {
    /**
     *
     * @param api {BattleshipApi}
     * @param name {string}
     */
    constructor(api, name) {
        this.api = api;
        this.name = name;
        this.loading = false;
    }

    /**
     *
     * @param parent {string}
     */
    addTo(parent = 'body') {
        this.parent = $(parent);

        this.draw();
        this.load();
    }

    destroy() {
        $(`#${this.name}`).remove();
    }

    load() {}
    draw() {}
    bind() {}
    observe() {}

    get loading() {
        return this._loading
    }

    set loading(value) {
        this._loading = value;
    }

    onError(reason, error) {
        // console.log(error);
        // swal({
        //     title: "You broke it :(",
        //     text: `<p>An error occurred, please reload the page to try again.</p><code>${reason}</code>`,
        //     type: "error",
        //     html: true
        // });

        let bsod = new BSODViewModel(this.api);
        bsod.addTo('body');

        this.loading = false;
    }
}