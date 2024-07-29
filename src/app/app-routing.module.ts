import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./vocabulary-list/vocabulary-list.module').then(m => m.VocabularyListModule)
  },
  {
    path: 'game',
    pathMatch: 'full',
    loadChildren: () => import('./vocabulary-game/vocabulary-game.module').then(m => m.VocabularyGameModule)
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {
}
