import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VocabularyGameComponent } from './vocabulary-game.component';

const routes: Routes = [
  {
    path: '',
    component: VocabularyGameComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})

export class VocabularyGameRoutingModule {
}
