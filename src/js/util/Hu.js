/**
 * Created by netvon on 20-5-16.
 */
export default class Hu {
    static append(element, html){
        element.innerHTML = `${element.innerHTML}${html}`;
    }

    static queryAppend(query, html){
        let el = document.querySelector(query);
        el.innerHTML = `${el.innerHTML}${html}`;
    }

}