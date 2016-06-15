import ViewModel from "./ViewModel";

export default class BSODViewModel extends ViewModel {
    constructor(api) {
        super(api, 'vm-bsod');
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
    }
}