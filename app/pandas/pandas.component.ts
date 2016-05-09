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
    bmai: any;
    koo: string;

    constructor(private _postService: PostService) {

        _postService.getPost().subscribe(data => {


            // let data_transform_array: any = {'date': [], 'value': [], 'names': []};

            // for (let key in data.author) {
            //     console.log(key);
            // };

            data.author = JSON.parse(data.author);


            let data_transform_array: any = [];

            for (let key in data.author) {

                if (data.author.hasOwnProperty(key)) {

                    data_transform_array.push({
                        _value: data.author[key].length,
                        date: new Date(+key),
                        names: (data.author[key])
                    });
                }
            }


            this.bmai = data_transform_array;
        });
    }

    getNewData() {

        this._postService.getPost().subscribe(data => {

            // let data_transform_array: any = {'date': [], 'value': [], 'names': []};
            data.author = JSON.parse(data.author);


            let data_transform_array: any = [];

            for (let key in data.author) {

                if (data.author.hasOwnProperty(key)) {

                    data_transform_array.push({
                        _value: data.author[key].length,
                        date: new Date(+key),
                        names: (data.author[key])
                    });
                }
            }


            this.bmai = data_transform_array;

        });
    }

}
