enum TaskPriority {
    LOW,
    MEDIUM,
    HIGH
}

export class Task {
    private _title: string;
    private _link: string;
    public status: string;
    public isMine: boolean = false;
    public priority: TaskPriority;

    constructor(title: string = "") {
        this.title = title;
        this.generateLink();
    }

    set title(title: string) {
        if (/\w+-\d+/gmi.test(title))
            this._title = title.toUpperCase();
        else
            throw new Error("Not valid Task title");
    }

    get title(): string {
        return this._title;
    }

    set link(link: string) {
        this._link = link;
    }

    get link(): string {
        return this._link;
    }

    private generateLink(): void {
        this.link = "https://planetecosystems.atlassian.net/browse/" + this.title;
    }
}