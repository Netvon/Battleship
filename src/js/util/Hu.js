export default class Hu {
    /**
     *
     * @param element 
     * @param html {string}
     */
    static append(element, html){
        element.innerHTML = `${element.innerHTML}${html}`;
    }

    /**
     *
     * @param query {string}
     * @param html {string}
     */
    static queryAppend(query, html){
        let el = document.querySelector(query);
        el.innerHTML = `${el.innerHTML}${html}`;
    }

    /**
     *
     * @param query {string}
     * @param html {string}
     */
    static querySet(query, html) {
        let el = document.querySelector(query);
        el.innerHTML = `${html}`;
    }

}