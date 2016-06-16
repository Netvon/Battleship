import ViewModel from "./ViewModel";
import BSTestViewModel from "./BSTestViewModel";

export default class TitleScreenViewModel extends ViewModel {
    constructor(api){
        super(api, 'vm-title');

        this.bsTestVM = new BSTestViewModel(this.api);
    }

    draw() {
        let template = `<main class="bs-fill-page bs-hero">
    <p class="bs-hero-title">
        Battleship
    </p>

    <button class="hero-button">Play</button>
    <p class="bs-hero-credit">Made by Sander & Tom</p>
</main>`;

        this.parent.append(template);

        this.bsTestVM.addTo('body');

        this.bind();
    }
}