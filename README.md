# aGroupFor

an angular collection repeater with groupping

[![Greenkeeper badge](https://badges.greenkeeper.io/kachav/aGroupFor.svg)](https://greenkeeper.io/)

[![travis build](https://img.shields.io/travis/kachav/aGroupFor.svg?style=flat-square)](https://travis-ci.org/kachav/aGroupFor)
[![codecov](https://img.shields.io/codecov/c/github/kachav/aGroupFor.svg?style=flat-square)](https://codecov.io/gh/kachav/aGroupFor)
[![version](https://img.shields.io/npm/v/agroupfor.svg?style=flat-square)](https://www.npmjs.com/package/agroupfor)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)


## Installation
```shell
npm install --save agroupfor
```
Once installed you need to import our main module:
```js
import {AGroupForModule} from 'agroupfor';

@NgModule({
  declarations: [AppComponent, ...],
  imports: [AGroupForModule, ...],  
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

## Usage:

The main usage for this directive is groupping whatever you want by one or more fields, without groupping fields it will work just like angular's *ngFor

    - item - collection item or item of group (group have only one property - value)
    - by ['surname'] - array of groupping fields, in this case for one grouping field it can be just "by 'surname'"
    - let group=groupName - current group's field name
    - let i=index - index of item in original collection
    - let childs=children - array of current group's children
    - let grLevel=groupLevel - level of current group
    - let par=parent - parent of current entity (item or group, no matter what)

```html
	<div *aGroupFor="let item of tableState.items$ | async by ['surname']; let group=groupName; let i=index; let childs=children; let grLevel=groupLevel; let par=parent;">
		<h3 *ngIf="group">
			{{item.value}}
			<span>({{childs.length}})</span>
		</h3>
		<span *ngIf="!group">
            <span>{{i+1}}</span>
            <span>{{item.name}}</span>
            <span>{{item.surname}}</span>
            <span>{{item.age}}</span>
		</span>
	</div>
```