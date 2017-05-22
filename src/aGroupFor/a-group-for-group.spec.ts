import { AGroupForGroup } from './a-group-for-group';

import { Component, ViewChild, TemplateRef } from "@angular/core";

import { async, inject, TestBed } from '@angular/core/testing';


describe('aGroupForGroup', () => {

    it('constructor creates $implicit field with value', () => {
        let testValue = "test value", instance = new AGroupForGroup(testValue, 'grName', 0);

        expect(instance.$implicit.value).toEqual(testValue);
    });

    it('children is empty array by default', () => {
        let instance = new AGroupForGroup("test", 'grName', 0);

        expect(instance.children).toEqual([]);
    });

    it('addChild removes current item from it\'s parent', () => {
        let instance = new AGroupForGroup("test", 'grName', 0),
            parent = { removeChild(value) { } }, item: any = { aa: 22 };

        spyOn(parent, 'removeChild');

        item.parent = parent;

        instance.addChild(item);

        expect(parent.removeChild).toHaveBeenCalled();

        expect(instance.children).toContain(item);
    });

    it('addChild adding item to it\'s children if children do not contains item', () => {
        let instance = new AGroupForGroup("test", 'grName', 0), item = { aa: 22 }, item2 = { aa: 33 };

        instance.addChild(item);

        expect(instance.children).toContain(item);

        instance.addChild(item);

        expect(instance.children).toContain(item);

        instance.addChild(item2);

        expect(instance.children).toContain(item2);
    });

    it('removeChild removes an item from children array', () => {
        let instance = new AGroupForGroup("test", 'grName', 0), item: any = { aa: 22 };

        instance.addChild(item);

        expect(item.parent).toBe(instance);

        expect(instance.children).toContain(item);

        instance.removeChild(item);

        expect(item.parent).toBeNull();

        expect(instance.children).not.toContain(item);
    });

    it('removeChild do not removes not existing childs', () => {
        let instance = new AGroupForGroup("test", 'grName', 0), item: any = { aa: 22, parent: null };

        expect(item.parent).toBeNull();

        expect(instance.children).not.toContain(item);

        instance.removeChild(item);

        expect(item.parent).toBeNull();

        expect(instance.children).not.toContain(item);
    });

    it('clearChilds fires removeChild on each child element', () => {
        let instance = new AGroupForGroup("test", 'grName', 0), testChilds = [{ aa: 11 }, { aa: 22 }, { aa: 33 }, { aa: 44 }];

        spyOn(instance, 'removeChild');

        instance.children = testChilds;

        instance.clearChilds();

        testChilds.forEach((item) => {
            expect(instance.removeChild).toHaveBeenCalledWith(item);
        });
    });

})