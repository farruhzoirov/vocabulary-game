import { NgModule } from '@angular/core';
import { VocabularyListComponent } from './vocabulary-list.component';
import { VocabularyListRoutingModule } from './vocabulary-list-routing.module';
import {DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage, NgStyle} from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    VocabularyListComponent
  ],
    imports: [
        VocabularyListRoutingModule,
        NgForOf,
        NgxPaginationModule,
        ReactiveFormsModule,
        NgIf,
        FormsModule,
        NgOptimizedImage,
        DatePipe,
        NgStyle,
        NgClass
    ]
})

export class VocabularyListModule {
}
