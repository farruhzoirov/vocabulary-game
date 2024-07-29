import {NgModule} from '@angular/core';
import {VocabularyGameComponent} from './vocabulary-game.component';
import {VocabularyGameRoutingModule} from './vocabulary-game-routing.module';
import { NgIf, NgOptimizedImage } from '@angular/common';
import {FormsModule} from "@angular/forms";
import { HideWordPipe } from '../pipes/hide-word.pipe';

@NgModule({
  declarations: [
    VocabularyGameComponent
  ],
    imports: [
        VocabularyGameRoutingModule,
        NgIf,
        FormsModule,
        NgOptimizedImage,
        HideWordPipe
    ]
})

export class VocabularyGameModule {
}
