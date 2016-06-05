export default class JsonBase {

    toJson() {
        return JSON.stringify(this);
    }

    static fromJson(jsonObject) {
        return jsonObject;
    }
}