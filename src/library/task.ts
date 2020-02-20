export class Task {
    private _title : string;
    private _link : string;
    private status : string;
    private _isMine : boolean = false;

    constructor(title: string = "") {
        this.title = title;
        this.generateLink();
    }

    set title(title: string) {
        this._title = title;
    }

    get title() : string {
        return this._title;
    }

    set link(link : string) {
        this._link = link;
    }

    get link() : string {
        return this._link;
    }

    private generateLink() : void {
        this.link = "https://planetecosystems.atlassian.net/browse/" + this.title;
    }
}