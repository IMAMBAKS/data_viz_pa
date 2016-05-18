import {RouteDefinition} from '@angular/router-deprecated';
import {HomeComponent} from './home/home.component';
import {PandasComponent} from './pandas/pandas.component';
import {AtlasComponent} from './atlas/atlas.component';

export var APP_ROUTES: RouteDefinition[] = [
    {path: '/home', name: 'Home', component: HomeComponent, useAsDefault: true},
    {path: '/pandas', name: 'Pandas', component: PandasComponent},
    {path: '/atlas', name: 'Atlas', component: AtlasComponent},
];
