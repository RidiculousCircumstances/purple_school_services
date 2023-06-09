export class DocumentItem {

    public text: string;

    private state: DocumentItemState;

    constructor(text: string) {
        this.text = text;
        this.setState(new DraftDocumentItemState());
    }

    getState(): DocumentItemState {
        return this.state;
    }

    setState(state: DocumentItemState) {
        this.state = state;
        this.state.setContext(this);
    }

    publishDoc() {
        this.state.publish();
    }

    deleteDoc() {
        this.state.delete();
    }
}

abstract class DocumentItemState {

    public name: string;

    protected item: DocumentItem;

    constructor() {

    }

    public setContext(ctx: DocumentItem) {
        this.item = ctx;
    }

    public abstract publish(): void;

    public abstract delete(): void;
}

class DraftDocumentItemState extends DocumentItemState {

    constructor() {
        super();
        this.name = 'draft';
    }

    public publish(): void {
        console.log(`На сайт отправлен текст: ${this.item.text}`);
        this.item.setState(new PublishDocumentItemState());
    }
    public delete(): void {
        console.log('Документ удалён');
    }

}

class PublishDocumentItemState extends DocumentItemState {

    constructor() {
        super();
        this.name = 'publish';
    }

    public publish(): void {
        console.log('Документ уже опубликован');
    }
    public delete(): void {
        console.log('Снято с публикации');
        this.item.setState(new DraftDocumentItemState());
    }

}

const item = new DocumentItem('Як на псарне псари пёрлись');

console.log(item.getState());
item.publishDoc();
console.log(item.getState());
item.publishDoc();
item.deleteDoc();
console.log(item.getState());