import {Component} from '@angular/core';

import {BarChartDirective} from '../bar-chart/bar-chart.directive';
import {PostService} from './post.service';


@Component({
    selector: 'pandas',
    templateUrl: 'app/pandas/pandas.component.html',
    directives: [BarChartDirective],
    providers: [PostService]
})


export class PandasComponent {

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
