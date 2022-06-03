import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'tipo-documento',
        data: { pageTitle: 'simuSaber3Y5App.tipoDocumento.home.title' },
        loadChildren: () => import('./tipo-documento/tipo-documento.module').then(m => m.TipoDocumentoModule),
      },
      {
        path: 'user-data',
        data: { pageTitle: 'simuSaber3Y5App.userData.home.title' },
        loadChildren: () => import('./user-data/user-data.module').then(m => m.UserDataModule),
      },
      {
        path: 'docente',
        data: { pageTitle: 'simuSaber3Y5App.docente.home.title' },
        loadChildren: () => import('./docente/docente.module').then(m => m.DocenteModule),
      },
      {
        path: 'estudiante',
        data: { pageTitle: 'simuSaber3Y5App.estudiante.home.title' },
        loadChildren: () => import('./estudiante/estudiante.module').then(m => m.EstudianteModule),
      },
      {
        path: 'administrador',
        data: { pageTitle: 'simuSaber3Y5App.administrador.home.title' },
        loadChildren: () => import('./administrador/administrador.module').then(m => m.AdministradorModule),
      },
      {
        path: 'sala',
        data: { pageTitle: 'simuSaber3Y5App.sala.home.title' },
        loadChildren: () => import('./sala/sala.module').then(m => m.SalaModule),
      },
      {
        path: 'materia',
        data: { pageTitle: 'simuSaber3Y5App.materia.home.title' },
        loadChildren: () => import('./materia/materia.module').then(m => m.MateriaModule),
      },
      {
        path: 'prueba',
        data: { pageTitle: 'simuSaber3Y5App.prueba.home.title' },
        loadChildren: () => import('./prueba/prueba.module').then(m => m.PruebaModule),
      },
      {
        path: 'prueba-apoyo',
        data: { pageTitle: 'simuSaber3Y5App.pruebaApoyo.home.title' },
        loadChildren: () => import('./prueba-apoyo/prueba-apoyo.module').then(m => m.PruebaApoyoModule),
      },
      {
        path: 'banco-pregunta',
        data: { pageTitle: 'simuSaber3Y5App.bancoPregunta.home.title' },
        loadChildren: () => import('./banco-pregunta/banco-pregunta.module').then(m => m.BancoPreguntaModule),
      },
      {
        path: 'docente-materia',
        data: { pageTitle: 'simuSaber3Y5App.docenteMateria.home.title' },
        loadChildren: () => import('./docente-materia/docente-materia.module').then(m => m.DocenteMateriaModule),
      },
      {
        path: 'sala-materia',
        data: { pageTitle: 'simuSaber3Y5App.salaMateria.home.title' },
        loadChildren: () => import('./sala-materia/sala-materia.module').then(m => m.SalaMateriaModule),
      },
      {
        path: 'admi-banco-p',
        data: { pageTitle: 'simuSaber3Y5App.admiBancoP.home.title' },
        loadChildren: () => import('./admi-banco-p/admi-banco-p.module').then(m => m.AdmiBancoPModule),
      },
      {
        path: 'estudiante-sala',
        data: { pageTitle: 'simuSaber3Y5App.estudianteSala.home.title' },
        loadChildren: () => import('./estudiante-sala/estudiante-sala.module').then(m => m.EstudianteSalaModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
