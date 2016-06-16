import ViewModel from "./ViewModel";

export default class BSODViewModel extends ViewModel {
    constructor(api, errorCode, reason) {
        super(api, 'vm-bsod');

        this.errorCode = errorCode;
        this.reason = reason;

        console.log(this.reason);
    }

    draw() {
        let template = `<div id=${this.name} class="bs-fill-page bs-bsod">
<p><i class="fa fa-bomb fa-2x"></i></p>
    <h2>Well done, you broke it</h2>
    <p>An error occurred, please reload the page and try again.</p>
</div>`;

        this.parent.prepend(template);

        document.querySelector('.bs-bsod').scrollIntoView();
        this.parent.addClass('bs-bsod-html');

        if (this.errorCode !== undefined) {
            $(this.name).append(`<pre><code>Status: ${this.errorCode}</code></pre>`);
        }

        console.log(this.reason);

        if (this.reason !== null) {
            $(`#${this.name}`).append(`<pre><code>${this.reason}</code></pre>`);
        }
    }
}