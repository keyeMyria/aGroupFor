import { AGroupForDirective } from './a-group-for.directive';

import { Component, ViewChild, TemplateRef } from "@angular/core";

import { async, inject, TestBed } from '@angular/core/testing';

import { AGroupForGroup } from './a-group-for-group';

@Component({
    template: `
        <div *aGroupFor="let item of items by groups;trackBy:item?.id; let group=groupName; let i=index;let grLevel=groupLevel">{{group?'group '+item.value+' level '+grLevel:i+' '+item.field1+' '+item.field2+' '+item.field3+' '+item.field4}}</div>
        `,
    selector: 'test-container'
})
class testContainer {
    @ViewChild(AGroupForDirective) public targetDirective;

    groups = ['field1','field2']

    items: Array<any> = [
        { field1: "f1v1", field2: "f2v1", field3: "f3v1", field4: "f4v1", id: 1 },
        { field1: "f1v1", field2: "f2v2", field3: "f3v2", field4: "f4v1", id: 2 },
        { field1: "f1v1", field2: "f2v1", field3: "f3v3", field4: "f4v1", id: 3 },
        { field1: "f1v2", field2: "f2v3", field3: "f3v4", field4: "f4v1", id: 4 },
        { field1: "f1v2", field2: "f2v3", field3: "f3v5", field4: "f4v1", id: 5 }]
}


describe('AGroupFor.directive', () => {
    let instance, fixture;

    beforeEach(async(() => {
        return TestBed.configureTestingModule({

            declarations: [
                AGroupForDirective, testContainer, testContainerItemParent
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(testContainer);
            fixture.detectChanges();
            instance = fixture.componentInstance.targetDirective;
        });
    }));

    it('initial groupping on component create works', () => {
        //directive hsould create 5 elements (2 actual items and 3 groups)
        expect(fixture.nativeElement.children.length).toEqual(10);

        //field1 group f1v1
        expect(fixture.nativeElement.children[0].innerText).toEqual('group f1v1 level 0');
        //field2 group f2v1
        expect(fixture.nativeElement.children[1].innerText).toEqual('group f2v1 level 1');
        //group items
        expect(fixture.nativeElement.children[2].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[3].innerText).toEqual('2 f1v1 f2v1 f3v3 f4v1');

        //group f2v2
        expect(fixture.nativeElement.children[4].innerText).toEqual('group f2v2 level 1');
        //group item
        expect(fixture.nativeElement.children[5].innerText).toEqual('1 f1v1 f2v2 f3v2 f4v1');

        //group f1v2
        expect(fixture.nativeElement.children[6].innerText).toEqual('group f1v2 level 0');
        //group f2v3
        expect(fixture.nativeElement.children[7].innerText).toEqual('group f2v3 level 1');

        //group items
        expect(fixture.nativeElement.children[8].innerText).toEqual('3 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[9].innerText).toEqual('4 f1v2 f2v3 f3v5 f4v1');
    })


    it('new item should be in the first level groups', () => {
        fixture.componentInstance.items.push({ field1: "f1v1", field2: "f2v1", field3: "f3v6", field4: "f4v1", id: 6 })
        fixture.detectChanges();

        expect(fixture.nativeElement.children.length).toEqual(11);

        expect(fixture.nativeElement.children[4].innerText).toEqual('5 f1v1 f2v1 f3v6 f4v1');
    })

    it('removing last item should remove parent group', () => {
        (fixture.componentInstance.items as Array<any>).splice(1, 1);
        fixture.detectChanges();
        //should delete second item and second level group
        expect(fixture.nativeElement.children.length).toEqual(8);

        (fixture.componentInstance.items as Array<any>).splice(0);
        fixture.detectChanges();
        //should delete the rest of items and groups
        expect(fixture.nativeElement.children.length).toEqual(0);
    })

    it('items inside groups should be sort like in original collection', () => {
        let arr: Array<any> = fixture.componentInstance.items, item, secItem;

        item = arr[2];
        secItem = arr[0];

        fixture.componentInstance.items = arr =
            [
                item,
                secItem,
                ...arr.filter(filterItem => filterItem !== item && filterItem !== secItem)
            ];
        fixture.detectChanges();
        expect(fixture.nativeElement.children[2].innerText).toEqual('0 f1v1 f2v1 f3v3 f4v1');
        expect(fixture.nativeElement.children[3].innerText).toEqual('1 f1v1 f2v1 f3v1 f4v1');
    })

    it('removing group should remove all instances of it\'s group from dom', () => {
        (fixture.componentInstance.groups as Array<any>).splice(0, 1);
        fixture.detectChanges();
        expect(fixture.nativeElement.children.length).toEqual(8);

        expect(fixture.nativeElement.children[0].innerText).toEqual('group f2v1 level 0');
        expect(fixture.nativeElement.children[1].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[2].innerText).toEqual('2 f1v1 f2v1 f3v3 f4v1');

        expect(fixture.nativeElement.children[3].innerText).toEqual('group f2v2 level 0');
        expect(fixture.nativeElement.children[4].innerText).toEqual('1 f1v1 f2v2 f3v2 f4v1');

        expect(fixture.nativeElement.children[5].innerText).toEqual('group f2v3 level 0');
        expect(fixture.nativeElement.children[6].innerText).toEqual('3 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[7].innerText).toEqual('4 f1v2 f2v3 f3v5 f4v1');

        //clear all groups
        (fixture.componentInstance.groups as Array<any>).splice(0);
        fixture.detectChanges();
        expect(fixture.nativeElement.children.length).toEqual(5);

        expect(fixture.nativeElement.children[0].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[1].innerText).toEqual('1 f1v1 f2v2 f3v2 f4v1');
        expect(fixture.nativeElement.children[2].innerText).toEqual('2 f1v1 f2v1 f3v3 f4v1');
        expect(fixture.nativeElement.children[3].innerText).toEqual('3 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[4].innerText).toEqual('4 f1v2 f2v3 f3v5 f4v1');
    })

    it('groups can be null', () => {
        //clear all groups
        fixture.componentInstance.groups = null;
        fixture.detectChanges();
        expect(fixture.nativeElement.children.length).toEqual(5);

        expect(fixture.nativeElement.children[0].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[1].innerText).toEqual('1 f1v1 f2v2 f3v2 f4v1');
        expect(fixture.nativeElement.children[2].innerText).toEqual('2 f1v1 f2v1 f3v3 f4v1');
        expect(fixture.nativeElement.children[3].innerText).toEqual('3 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[4].innerText).toEqual('4 f1v2 f2v3 f3v5 f4v1');
    })

    it('single group can be set by string', () => {
        fixture.componentInstance.groups=fixture.componentInstance.groups[1];
        fixture.detectChanges();
        expect(fixture.nativeElement.children.length).toEqual(8);

        expect(fixture.nativeElement.children[0].innerText).toEqual('group f2v1 level 0');
        expect(fixture.nativeElement.children[1].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[2].innerText).toEqual('2 f1v1 f2v1 f3v3 f4v1');

        expect(fixture.nativeElement.children[3].innerText).toEqual('group f2v2 level 0');
        expect(fixture.nativeElement.children[4].innerText).toEqual('1 f1v1 f2v2 f3v2 f4v1');

        expect(fixture.nativeElement.children[5].innerText).toEqual('group f2v3 level 0');
        expect(fixture.nativeElement.children[6].innerText).toEqual('3 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[7].innerText).toEqual('4 f1v2 f2v3 f3v5 f4v1');
    })

    it('adding group in the center should regroup every lower level children', () => {
        let arr: Array<any> = fixture.componentInstance.groups;

        arr = [arr[0], "field4", arr[1]];

        fixture.componentInstance.groups = arr;
        fixture.detectChanges();

        //directive hsould create 5 elements (2 actual items and 3 groups)
        expect(fixture.nativeElement.children.length).toEqual(12);

        //field1 group f1v1
        expect(fixture.nativeElement.children[0].innerText).toEqual('group f1v1 level 0');
        //field 4 group f4v1
        expect(fixture.nativeElement.children[1].innerText).toEqual('group f4v1 level 1');
        //field2 group f2v1
        expect(fixture.nativeElement.children[2].innerText).toEqual('group f2v1 level 2');
        //group items
        expect(fixture.nativeElement.children[3].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[4].innerText).toEqual('2 f1v1 f2v1 f3v3 f4v1');

        //group f2v2
        expect(fixture.nativeElement.children[5].innerText).toEqual('group f2v2 level 2');
        //group item
        expect(fixture.nativeElement.children[6].innerText).toEqual('1 f1v1 f2v2 f3v2 f4v1');

        //group f1v2
        expect(fixture.nativeElement.children[7].innerText).toEqual('group f1v2 level 0');
        //field 4 group f4v1
        expect(fixture.nativeElement.children[8].innerText).toEqual('group f4v1 level 1');
        //group f2v3
        expect(fixture.nativeElement.children[9].innerText).toEqual('group f2v3 level 2');

        //group items
        expect(fixture.nativeElement.children[10].innerText).toEqual('3 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[11].innerText).toEqual('4 f1v2 f2v3 f3v5 f4v1');
    })

    it('adding group in the start should regroup every lower level children', () => {
        let arr: Array<any> = fixture.componentInstance.groups;

        arr = ["field4", ...arr];

        fixture.componentInstance.groups = arr;
        fixture.detectChanges();

        //directive hsould create 5 elements (2 actual items and 3 groups)
        expect(fixture.nativeElement.children.length).toEqual(11);

        //field 4 group f4v1
        expect(fixture.nativeElement.children[0].innerText).toEqual('group f4v1 level 0');
        //field1 group f1v1
        expect(fixture.nativeElement.children[1].innerText).toEqual('group f1v1 level 1');
        //field2 group f2v1
        expect(fixture.nativeElement.children[2].innerText).toEqual('group f2v1 level 2');
        //group items
        expect(fixture.nativeElement.children[3].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[4].innerText).toEqual('2 f1v1 f2v1 f3v3 f4v1');

        //group f2v2
        expect(fixture.nativeElement.children[5].innerText).toEqual('group f2v2 level 2');
        //group item
        expect(fixture.nativeElement.children[6].innerText).toEqual('1 f1v1 f2v2 f3v2 f4v1');

        //group f1v2
        expect(fixture.nativeElement.children[7].innerText).toEqual('group f1v2 level 1');
        //group f2v3
        expect(fixture.nativeElement.children[8].innerText).toEqual('group f2v3 level 2');

        //group items
        expect(fixture.nativeElement.children[9].innerText).toEqual('3 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[10].innerText).toEqual('4 f1v2 f2v3 f3v5 f4v1');
    })

    it('adding group in the end should add new group level', () => {
        let arr: Array<any> = fixture.componentInstance.groups;

        arr = [...arr, "field4"];

        fixture.componentInstance.groups = arr;
        fixture.detectChanges();

        expect(fixture.nativeElement.children.length).toEqual(13);


        //field1 group f1v1
        expect(fixture.nativeElement.children[0].innerText).toEqual('group f1v1 level 0');
        //field2 group f2v1
        expect(fixture.nativeElement.children[1].innerText).toEqual('group f2v1 level 1');
        //field 4 group f4v1
        expect(fixture.nativeElement.children[2].innerText).toEqual('group f4v1 level 2');
        //group items
        expect(fixture.nativeElement.children[3].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[4].innerText).toEqual('2 f1v1 f2v1 f3v3 f4v1');

        //group f2v2
        expect(fixture.nativeElement.children[5].innerText).toEqual('group f2v2 level 1');
        //field 4 group f4v1
        expect(fixture.nativeElement.children[6].innerText).toEqual('group f4v1 level 2');
        //group item
        expect(fixture.nativeElement.children[7].innerText).toEqual('1 f1v1 f2v2 f3v2 f4v1');

        //group f1v2
        expect(fixture.nativeElement.children[8].innerText).toEqual('group f1v2 level 0');
        //group f2v3
        expect(fixture.nativeElement.children[9].innerText).toEqual('group f2v3 level 1');
        //field 4 group f4v1
        expect(fixture.nativeElement.children[10].innerText).toEqual('group f4v1 level 2');

        //group items
        expect(fixture.nativeElement.children[11].innerText).toEqual('3 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[12].innerText).toEqual('4 f1v2 f2v3 f3v5 f4v1');
    })


    it('when we change value in the item, dom element changes', () => {
        expect(fixture.nativeElement.children[2].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');

        fixture.componentInstance.items[0].field3 = 'field3test';

        fixture.componentInstance.items = [...fixture.componentInstance.items]

        fixture.detectChanges();

        expect(fixture.nativeElement.children[2].innerText).toEqual('0 f1v1 f2v1 field3test f4v1');
    });

    it('items without groups should be sort like in original collection', () => {
        fixture.componentInstance.groups = [];

        fixture.detectChanges();

        expect(fixture.nativeElement.children[0].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[1].innerText).toEqual('1 f1v1 f2v2 f3v2 f4v1');
        expect(fixture.nativeElement.children[2].innerText).toEqual('2 f1v1 f2v1 f3v3 f4v1');
        expect(fixture.nativeElement.children[3].innerText).toEqual('3 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[4].innerText).toEqual('4 f1v2 f2v3 f3v5 f4v1');
        let items: Array<any> = fixture.componentInstance.items;

        fixture.componentInstance.items = [items[items.length - 1], ...items.slice(0, items.length - 1)];
        fixture.detectChanges();
        expect(fixture.nativeElement.children[0].innerText).toEqual('0 f1v2 f2v3 f3v5 f4v1');
        expect(fixture.nativeElement.children[1].innerText).toEqual('1 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[2].innerText).toEqual('2 f1v1 f2v2 f3v2 f4v1');
        expect(fixture.nativeElement.children[3].innerText).toEqual('3 f1v1 f2v1 f3v3 f4v1');
        expect(fixture.nativeElement.children[4].innerText).toEqual('4 f1v2 f2v3 f3v4 f4v1');
    })

    it('inserting should insert item in the right position', () => {
        let newItem = { field1: "f1test", field2: "f2test", field3: "f3test", field4: "f4test", id: 6 };
        fixture.componentInstance.groups = [];

        fixture.detectChanges();

        expect(fixture.nativeElement.children[0].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[1].innerText).toEqual('1 f1v1 f2v2 f3v2 f4v1');
        expect(fixture.nativeElement.children[2].innerText).toEqual('2 f1v1 f2v1 f3v3 f4v1');
        expect(fixture.nativeElement.children[3].innerText).toEqual('3 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[4].innerText).toEqual('4 f1v2 f2v3 f3v5 f4v1');
        let items: Array<any> = fixture.componentInstance.items;

        let rightPart = items.slice(2), leftPart = items.slice(0, 2);

        fixture.componentInstance.items = [...leftPart, newItem, ...rightPart];
        fixture.detectChanges();
        expect(fixture.nativeElement.children[0].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[1].innerText).toEqual('1 f1v1 f2v2 f3v2 f4v1');
        expect(fixture.nativeElement.children[2].innerText).toEqual('2 f1test f2test f3test f4test');
        expect(fixture.nativeElement.children[3].innerText).toEqual('3 f1v1 f2v1 f3v3 f4v1');
        expect(fixture.nativeElement.children[4].innerText).toEqual('4 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[5].innerText).toEqual('5 f1v2 f2v3 f3v5 f4v1');
    })


    it('should regroup when groups order changes', () => {
        let arr = fixture.componentInstance.groups;

        fixture.componentInstance.groups = [arr[1], arr[0]];
        fixture.detectChanges();

        expect(fixture.nativeElement.children.length).toEqual(11);


        //field2 group f2v1
        expect(fixture.nativeElement.children[0].innerText).toEqual('group f2v1 level 0');
        //field1 group f1v1
        expect(fixture.nativeElement.children[1].innerText).toEqual('group f1v1 level 1');

        //group items
        expect(fixture.nativeElement.children[2].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[3].innerText).toEqual('2 f1v1 f2v1 f3v3 f4v1');

        //group f2v2
        expect(fixture.nativeElement.children[4].innerText).toEqual('group f2v2 level 0');
        //field1 group f1v1
        expect(fixture.nativeElement.children[5].innerText).toEqual('group f1v1 level 1');
        //group item
        expect(fixture.nativeElement.children[6].innerText).toEqual('1 f1v1 f2v2 f3v2 f4v1');

        //group f2v3
        expect(fixture.nativeElement.children[7].innerText).toEqual('group f2v3 level 0');
        //group f1v2
        expect(fixture.nativeElement.children[8].innerText).toEqual('group f1v2 level 1');

        //group items
        expect(fixture.nativeElement.children[9].innerText).toEqual('3 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[10].innerText).toEqual('4 f1v2 f2v3 f3v5 f4v1');

    });

    it('adding item as first moves it\'s group to the top', () => {
        //directive hsould create 5 elements (2 actual items and 3 groups)
        expect(fixture.nativeElement.children.length).toEqual(10);

        //field1 group f1v1
        expect(fixture.nativeElement.children[0].innerText).toEqual('group f1v1 level 0');
        //field2 group f2v1
        expect(fixture.nativeElement.children[1].innerText).toEqual('group f2v1 level 1');
        //group items
        expect(fixture.nativeElement.children[2].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[3].innerText).toEqual('2 f1v1 f2v1 f3v3 f4v1');

        //group f2v2
        expect(fixture.nativeElement.children[4].innerText).toEqual('group f2v2 level 1');
        //group item
        expect(fixture.nativeElement.children[5].innerText).toEqual('1 f1v1 f2v2 f3v2 f4v1');

        //group f1v2
        expect(fixture.nativeElement.children[6].innerText).toEqual('group f1v2 level 0');
        //group f2v3
        expect(fixture.nativeElement.children[7].innerText).toEqual('group f2v3 level 1');

        //group items
        expect(fixture.nativeElement.children[8].innerText).toEqual('3 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[9].innerText).toEqual('4 f1v2 f2v3 f3v5 f4v1');

        fixture.componentInstance.items = [
            { field1: "f1v2", field2: "f2v3", field3: "f3v5", field4: "test first item", id: 6 }, ...fixture.componentInstance.items];

        fixture.detectChanges();

        expect(fixture.nativeElement.children.length).toEqual(11);

        //group f1v2
        expect(fixture.nativeElement.children[0].innerText).toEqual('group f1v2 level 0');
        //group f2v3
        expect(fixture.nativeElement.children[1].innerText).toEqual('group f2v3 level 1');

        //group items
        expect(fixture.nativeElement.children[2].innerText).toEqual('0 f1v2 f2v3 f3v5 test first item');
        expect(fixture.nativeElement.children[3].innerText).toEqual('4 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[4].innerText).toEqual('5 f1v2 f2v3 f3v5 f4v1');

        //field1 group f1v1
        expect(fixture.nativeElement.children[5].innerText).toEqual('group f1v1 level 0');
        //field2 group f2v1
        expect(fixture.nativeElement.children[6].innerText).toEqual('group f2v1 level 1');
        //group items
        expect(fixture.nativeElement.children[7].innerText).toEqual('1 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[8].innerText).toEqual('3 f1v1 f2v1 f3v3 f4v1');

        //group f2v2
        expect(fixture.nativeElement.children[9].innerText).toEqual('group f2v2 level 1');
        //group item
        expect(fixture.nativeElement.children[10].innerText).toEqual('2 f1v1 f2v2 f3v2 f4v1');
    })

    it('deleting first item in group moves it\'s group down', () => {
        //directive hsould create 5 elements (2 actual items and 3 groups)
        expect(fixture.nativeElement.children.length).toEqual(10);

        //field1 group f1v1
        expect(fixture.nativeElement.children[0].innerText).toEqual('group f1v1 level 0');
        //field2 group f2v1
        expect(fixture.nativeElement.children[1].innerText).toEqual('group f2v1 level 1');
        //group items
        expect(fixture.nativeElement.children[2].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[3].innerText).toEqual('2 f1v1 f2v1 f3v3 f4v1');

        //group f2v2
        expect(fixture.nativeElement.children[4].innerText).toEqual('group f2v2 level 1');
        //group item
        expect(fixture.nativeElement.children[5].innerText).toEqual('1 f1v1 f2v2 f3v2 f4v1');

        //group f1v2
        expect(fixture.nativeElement.children[6].innerText).toEqual('group f1v2 level 0');
        //group f2v3
        expect(fixture.nativeElement.children[7].innerText).toEqual('group f2v3 level 1');

        //group items
        expect(fixture.nativeElement.children[8].innerText).toEqual('3 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[9].innerText).toEqual('4 f1v2 f2v3 f3v5 f4v1');

        fixture.componentInstance.items = fixture.componentInstance.items.slice(1);

        fixture.detectChanges();

        expect(fixture.nativeElement.children.length).toEqual(9);

                //field1 group f1v1
        expect(fixture.nativeElement.children[0].innerText).toEqual('group f1v1 level 0');

        //group f2v2
        expect(fixture.nativeElement.children[1].innerText).toEqual('group f2v2 level 1');
        //group item
        expect(fixture.nativeElement.children[2].innerText).toEqual('0 f1v1 f2v2 f3v2 f4v1');

                //field2 group f2v1
        expect(fixture.nativeElement.children[3].innerText).toEqual('group f2v1 level 1');
        //group items
        expect(fixture.nativeElement.children[4].innerText).toEqual('1 f1v1 f2v1 f3v3 f4v1');

        //group f1v2
        expect(fixture.nativeElement.children[5].innerText).toEqual('group f1v2 level 0');
        //group f2v3
        expect(fixture.nativeElement.children[6].innerText).toEqual('group f2v3 level 1');

        //group items
        expect(fixture.nativeElement.children[7].innerText).toEqual('2 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[8].innerText).toEqual('3 f1v2 f2v3 f3v5 f4v1');
    })

    it('reordering items reorder a groups', () => {
        //directive hsould create 5 elements (2 actual items and 3 groups)
        expect(fixture.nativeElement.children.length).toEqual(10);

        //field1 group f1v1
        expect(fixture.nativeElement.children[0].innerText).toEqual('group f1v1 level 0');
        //field2 group f2v1
        expect(fixture.nativeElement.children[1].innerText).toEqual('group f2v1 level 1');
        //group items
        expect(fixture.nativeElement.children[2].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[3].innerText).toEqual('2 f1v1 f2v1 f3v3 f4v1');

        //group f2v2
        expect(fixture.nativeElement.children[4].innerText).toEqual('group f2v2 level 1');
        //group item
        expect(fixture.nativeElement.children[5].innerText).toEqual('1 f1v1 f2v2 f3v2 f4v1');

        //group f1v2
        expect(fixture.nativeElement.children[6].innerText).toEqual('group f1v2 level 0');
        //group f2v3
        expect(fixture.nativeElement.children[7].innerText).toEqual('group f2v3 level 1');

        //group items
        expect(fixture.nativeElement.children[8].innerText).toEqual('3 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[9].innerText).toEqual('4 f1v2 f2v3 f3v5 f4v1');

        let arr = fixture.componentInstance.items;

        fixture.componentInstance.items = [arr[3],arr[4],arr[1],arr[0], arr[2]];

        fixture.detectChanges();

        expect(fixture.nativeElement.children.length).toEqual(10);

        //group f1v2
        expect(fixture.nativeElement.children[0].innerText).toEqual('group f1v2 level 0');
        //group f2v3
        expect(fixture.nativeElement.children[1].innerText).toEqual('group f2v3 level 1');

        //group items
        expect(fixture.nativeElement.children[2].innerText).toEqual('0 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[3].innerText).toEqual('1 f1v2 f2v3 f3v5 f4v1');

        //field1 group f1v1
        expect(fixture.nativeElement.children[4].innerText).toEqual('group f1v1 level 0');

        //group f2v2
        expect(fixture.nativeElement.children[5].innerText).toEqual('group f2v2 level 1');
        //group item
        expect(fixture.nativeElement.children[6].innerText).toEqual('2 f1v1 f2v2 f3v2 f4v1');

        //field2 group f2v1
        expect(fixture.nativeElement.children[7].innerText).toEqual('group f2v1 level 1');
        //group items
        expect(fixture.nativeElement.children[8].innerText).toEqual('3 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[9].innerText).toEqual('4 f1v1 f2v1 f3v3 f4v1');
    });

    it('adding new item adds new group to the right place', () => {
        //directive hsould create 5 elements (2 actual items and 3 groups)
        expect(fixture.nativeElement.children.length).toEqual(10);

        //field1 group f1v1
        expect(fixture.nativeElement.children[0].innerText).toEqual('group f1v1 level 0');
        //field2 group f2v1
        expect(fixture.nativeElement.children[1].innerText).toEqual('group f2v1 level 1');
        //group items
        expect(fixture.nativeElement.children[2].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[3].innerText).toEqual('2 f1v1 f2v1 f3v3 f4v1');

        //group f2v2
        expect(fixture.nativeElement.children[4].innerText).toEqual('group f2v2 level 1');
        //group item
        expect(fixture.nativeElement.children[5].innerText).toEqual('1 f1v1 f2v2 f3v2 f4v1');

        //group f1v2
        expect(fixture.nativeElement.children[6].innerText).toEqual('group f1v2 level 0');
        //group f2v3
        expect(fixture.nativeElement.children[7].innerText).toEqual('group f2v3 level 1');

        //group items
        expect(fixture.nativeElement.children[8].innerText).toEqual('3 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[9].innerText).toEqual('4 f1v2 f2v3 f3v5 f4v1');

        let arr = fixture.componentInstance.items;

        fixture.componentInstance.items = [arr[0], { field1: "f1v1", field2: "f2vtest", field3: "f3v2", field4: "f4v1", id: 6 },arr[1],arr[2],arr[3], arr[4]];

        fixture.detectChanges();

        expect(fixture.nativeElement.children.length).toEqual(12);

        //field1 group f1v1
        expect(fixture.nativeElement.children[0].innerText).toEqual('group f1v1 level 0');
        //field2 group f2v1
        expect(fixture.nativeElement.children[1].innerText).toEqual('group f2v1 level 1');
        //group items
        expect(fixture.nativeElement.children[2].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[3].innerText).toEqual('3 f1v1 f2v1 f3v3 f4v1');

        //group f2vtest
        expect(fixture.nativeElement.children[4].innerText).toEqual('group f2vtest level 1');
        //group item
        expect(fixture.nativeElement.children[5].innerText).toEqual('1 f1v1 f2vtest f3v2 f4v1');

        //group f2v2
        expect(fixture.nativeElement.children[6].innerText).toEqual('group f2v2 level 1');
        //group item
        expect(fixture.nativeElement.children[7].innerText).toEqual('2 f1v1 f2v2 f3v2 f4v1');

        //group f1v2
        expect(fixture.nativeElement.children[8].innerText).toEqual('group f1v2 level 0');
        //group f2v3
        expect(fixture.nativeElement.children[9].innerText).toEqual('group f2v3 level 1');

        //group items
        expect(fixture.nativeElement.children[10].innerText).toEqual('4 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[11].innerText).toEqual('5 f1v2 f2v3 f3v5 f4v1');
    });

});


//component to checking existing of parent after regrouping
@Component({
    template: `
        <div *aGroupFor="let item of items by groups;trackBy:item?.id; let group=groupName; let par=parent;">{{group?'group '+item.value:item.id+' '+(par?'true':'false')}}</div>
        `,
    selector: 'test-container-item-parent'
})
class testContainerItemParent {
    @ViewChild(AGroupForDirective) public targetDirective;

    groups = ['field1', 'field2']

    items: Array<any> = [
        { field1: "f1v1", field2: "f2v1", field3: "f3v1", field4: "f4v1", id: 1 },
        { field1: "f1v1", field2: "f2v2", field3: "f3v2", field4: "f4v1", id: 2 },
        { field1: "f1v1", field2: "f2v1", field3: "f3v3", field4: "f4v1", id: 3 },
        { field1: "f1v2", field2: "f2v3", field3: "f3v4", field4: "f4v1", id: 4 },
        { field1: "f1v2", field2: "f2v3", field3: "f3v5", field4: "f4v1", id: 5 }]
}

describe('aGroupFor.directive testing item parent', () => {
    let testParentFixture, testParentInstance;
    beforeEach(async(() => {
        return TestBed.configureTestingModule({

            declarations: [
                AGroupForDirective, testContainerItemParent
            ]
        }).compileComponents().then(() => {


            testParentFixture = TestBed.createComponent(testContainerItemParent);
            testParentFixture.detectChanges();
            testParentInstance = testParentFixture.componentInstance.targetDirective;
        });
    }));


    it('items with initial groupping has parent', () => {
        //directive hsould create 5 elements (2 actual items and 3 groups)
        expect(testParentFixture.nativeElement.children.length).toEqual(10);

        //field1 group f1v1
        expect(testParentFixture.nativeElement.children[0].innerText).toEqual('group f1v1');
        //field2 group f2v1
        expect(testParentFixture.nativeElement.children[1].innerText).toEqual('group f2v1');
        //group items
        expect(testParentFixture.nativeElement.children[2].innerText).toEqual('1 true');
        expect(testParentFixture.nativeElement.children[3].innerText).toEqual('3 true');

        //group f2v2
        expect(testParentFixture.nativeElement.children[4].innerText).toEqual('group f2v2');
        //group item
        expect(testParentFixture.nativeElement.children[5].innerText).toEqual('2 true');

        //group f1v2
        expect(testParentFixture.nativeElement.children[6].innerText).toEqual('group f1v2');
        //group f2v3
        expect(testParentFixture.nativeElement.children[7].innerText).toEqual('group f2v3');

        //group items
        expect(testParentFixture.nativeElement.children[8].innerText).toEqual('4 true');
        expect(testParentFixture.nativeElement.children[9].innerText).toEqual('5 true');
    })

    it('when we remove one group, parent should exist', () => {
        (testParentFixture.componentInstance.groups as Array<any>).splice(0, 1);
        testParentFixture.detectChanges();
        expect(testParentFixture.nativeElement.children.length).toEqual(8);

        expect(testParentFixture.nativeElement.children[0].innerText).toEqual('group f2v1');
        expect(testParentFixture.nativeElement.children[1].innerText).toEqual('1 true');
        expect(testParentFixture.nativeElement.children[2].innerText).toEqual('3 true');

        expect(testParentFixture.nativeElement.children[3].innerText).toEqual('group f2v2');
        expect(testParentFixture.nativeElement.children[4].innerText).toEqual('2 true');

        expect(testParentFixture.nativeElement.children[5].innerText).toEqual('group f2v3');
        expect(testParentFixture.nativeElement.children[6].innerText).toEqual('4 true');
        expect(testParentFixture.nativeElement.children[7].innerText).toEqual('5 true');
    })

    it('items without groupping should not have parent', () => {
        (testParentFixture.componentInstance.groups as Array<any>).splice(0);
        testParentFixture.detectChanges();
        expect(testParentFixture.nativeElement.children.length).toEqual(5);

        expect(testParentFixture.nativeElement.children[0].innerText).toEqual('1 false');
        expect(testParentFixture.nativeElement.children[1].innerText).toEqual('2 false');
        expect(testParentFixture.nativeElement.children[2].innerText).toEqual('3 false');
        expect(testParentFixture.nativeElement.children[3].innerText).toEqual('4 false');
        expect(testParentFixture.nativeElement.children[4].innerText).toEqual('5 false');
    })

    it('adding group should add a parent', () => {
        (testParentFixture.componentInstance.groups as Array<any>).splice(0);
        testParentFixture.detectChanges();
        expect(testParentFixture.nativeElement.children.length).toEqual(5);

        expect(testParentFixture.nativeElement.children[0].innerText).toEqual('1 false');
        expect(testParentFixture.nativeElement.children[1].innerText).toEqual('2 false');
        expect(testParentFixture.nativeElement.children[2].innerText).toEqual('3 false');
        expect(testParentFixture.nativeElement.children[3].innerText).toEqual('4 false');
        expect(testParentFixture.nativeElement.children[4].innerText).toEqual('5 false');

        testParentFixture.componentInstance.groups=['field2'];
        testParentFixture.detectChanges();
        expect(testParentFixture.nativeElement.children.length).toEqual(8);

        expect(testParentFixture.nativeElement.children[0].innerText).toEqual('group f2v1');
        expect(testParentFixture.nativeElement.children[1].innerText).toEqual('1 true');
        expect(testParentFixture.nativeElement.children[2].innerText).toEqual('3 true');

        expect(testParentFixture.nativeElement.children[3].innerText).toEqual('group f2v2');
        expect(testParentFixture.nativeElement.children[4].innerText).toEqual('2 true');

        expect(testParentFixture.nativeElement.children[5].innerText).toEqual('group f2v3');
        expect(testParentFixture.nativeElement.children[6].innerText).toEqual('4 true');
        expect(testParentFixture.nativeElement.children[7].innerText).toEqual('5 true');
    })

})