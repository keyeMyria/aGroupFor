import {EmbeddedViewRef} from '@angular/core';

import {AGroupForRow} from './a-group-for-row';

export class RecordViewTuple {
    constructor(public record: any, public view: EmbeddedViewRef<AGroupForRow>) { }
}
