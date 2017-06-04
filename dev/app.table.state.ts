import { Injectable, EventEmitter, Renderer } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class HomeTableState {

    public groupBy: string[] = [];

    public set groupBySurname(value) {
        this._groupBySurname = value;
        this.updateGroupByArray();
    }

    public get groupBySurname() {
        return this._groupBySurname;
    }

    public set groupByName(value) {
        this._groupByName = value;
        this.updateGroupByArray();
    }

    public get groupByName() {
        return this._groupByName;
    }

    private _groupBySurname = true;

    private _groupByName = false;

    private _items: BehaviorSubject<any[]>;

    private count = 0;

    constructor(private renderer: Renderer) {
        this._items = new BehaviorSubject<any[]>([]);

        this.updateGroupByArray();
        this.load();

    }

    get items$() {
        return this._items.asObservable();
    }
    get items() {
        return this._items.getValue();
    }

    public modifyDays(index: number, value: number) {
        let items = this._items.getValue();

        if (items[index]) {
            items[index].eee = items[index].eee + value;
            this._items.next([...items]);
        }
    }

    public removeItem(row) {
        console.log(JSON.stringify(this._items.getValue()));
        this._items.next(this._items.getValue().filter((item) => item._ouid !== row._ouid));
    }

    public addItem() {
        let item = this._newItem();
        let arr = [...this._items.getValue(), this._newItem()];
        this._items.next(arr);
    }

    public sortBy(fieldName) {
        let arr = this._items.getValue();
        arr = arr.sort((a, b) => {
            let aval = a[fieldName] || 0;
            let bval = b[fieldName] || 0;
            if (aval < bval) {
                return -1;
            }
            if (aval > bval) {
                return 1;
            }
            return 0;
        });
        this._items.next([...arr]);
    }

    public load() {
        let arr = [];
        for (let i = 1; i < 100; i++) {
            arr.push(this._newItem());
        }

        this._items.next(arr);
    }

    private updateGroupByArray() {
        let arr = [];
        if (this._groupBySurname) {
            arr.push('surname');
        }
        if (this._groupByName) {
            arr.push('name');
        }

        this.groupBy = arr;
    }

    private _newItem() {
        let surnameValues = ['Иванов', 'Петров', 'Сидоров', 'Бананов', 'Пустозвонов', 'Бонд', 'Смит'];
        let patrionityValues = [
            'Иванович', 'Петрович', 'Аристархович',
            'Николаевич', 'Васильевич', 'Олегович'];
        let nameValues = ['Иван', 'Петр', 'Василий', 'Евлампий', 'Дмитрий', 'Николай'];

        let getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];
        this.count++;
        return {
            _ouid: this.count, surname: getRandomItem(surnameValues),
            name: getRandomItem(nameValues), patrionity: getRandomItem(patrionityValues), eee: 1
        };
    }
}
