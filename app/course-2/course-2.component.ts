import {Component} from '@angular/core';

import {BarChartDirective} from '../bar-chart/bar-chart.directive';
import {PostService} from './post.service';


@Component({
    selector: 'course-2',
    templateUrl: 'app/course-2/course-2.component.html',
    directives: [BarChartDirective],
    providers: [PostService]
})


export class CourseTwoComponent {

    active;
    bmai: number[];
    koo: string;

    constructor(private _postService: PostService) {

        _postService.getPost().subscribe(data => {


            this.bmai = data.author;

        });
    }

    getNewData() {

        this._postService.getPost().subscribe(data => {

            this.bmai = data.author;

        });
    }

}
