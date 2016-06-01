import {RouteDefinition} from '@angular/router-deprecated';
// import {HomeComponent} from './home/home.component';
import {PandasComponent} from './pandas/pandas.component';
// import {AtlasComponent} from './atlas/atlas.component';

export var APP_ROUTES: RouteDefinition[] = [
    // {path: '/home', name: 'Home', component: HomeComponent},
    {path: '/dashboard', name: 'Dasboard', component: PandasComponent, useAsDefault: true}
    // {path: '/atlas', name: 'Atlas', component: AtlasComponent},
];
