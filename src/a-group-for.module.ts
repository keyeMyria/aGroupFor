import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { COMPILER_PROVIDERS } from '@angular/compiler';

import { AGroupForDirective } from './aGroupFor/a-group-for.directive';

@NgModule({
    imports: [CommonModule],
    providers: [
        COMPILER_PROVIDERS
    ],
    declarations: [
        AGroupForDirective
    ],
    exports: [
        AGroupForDirective
    ]
})
export class AGroupForModule { }
