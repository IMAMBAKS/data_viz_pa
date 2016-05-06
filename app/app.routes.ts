import {RouteDefinition} from '@angular/router-deprecated';
import {HomeComponent} from './home/home.component';
import {CourseTwoComponent} from './course-2/course-2.component';

export var APP_ROUTES: RouteDefinition[] = [
    {path: '/home', name: 'Home', component: HomeComponent, useAsDefault: true},
    {path: '/course-two', name: 'CourseTwo', component: CourseTwoComponent},
];
