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
    public isPriority: boolean = false;
    public priority: TaskPriority;

    constructor(title: string = "") {
        this.title = title;
        this.generateLink();
    }

    set title(title: string) {
        if (/^[A-Za-z]+-\d+$/gmi.test(title))
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

    // TODO: finish this
    public async updateStatus(): Promise<string> {
        let response = await fetch(this.link);
        let html = await response.text();

        let doc = new DOMParser().parseFromString(html, 'text/html');
        let status: string = "";

        if (doc.querySelector('#status-val span'))
            status = doc.querySelector('#status-val span').innerHTML;

        if (!response.ok) {
            this.status = "error";
        }
        else if (doc.querySelector('.people-details dt[title="Original Developer"]') && status.indexOf("Open") > -1) {
            this.status = "Reopened";
        }
        else {
            this.status = status;
        }

        return this.status;
    }
}