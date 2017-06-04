import { ViewRef } from '@angular/core';

export class AGroupForGroup {

    public $implicit;
    public parent: AGroupForGroup;
    public children: any[] = [];
    public view: ViewRef;

    constructor(public value: string,
        public groupName: string,
        public groupLevel: number) {
        this.$implicit = {
            value
        };
    }

    public removeChild(item) {
        let index = this.children.indexOf(item);
        if (item.parent === this) {
            item.parent = null;
        }

        if (index > -1) {

            this.children.splice(index, 1);
        }
    }

    public clearChilds() {
        let childArray = [...this.children];

        childArray.forEach((child) => {
            this.removeChild(child);
        });
    }

    public addChild(item) {
        if (item.parent) {
            item.parent.removeChild(item);
        }

        item.parent = this;
        this.children.push(item);

    }
}
