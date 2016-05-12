import {Component} from '@angular/core';
import {BarChartDirective} from '../bar-chart/bar-chart.directive';
import {PostService} from './post.service';
import {ControlGroup, FormBuilder, Validators} from '@angular/common';
import {DateValidators} from './dateValidators';

@Component({
    selector: 'pandas',
    templateUrl: 'app/pandas/pandas.component.html',
    directives: [BarChartDirective],
    providers: [PostService]
})


export class PandasComponent {


    active;
    bmai: any;
    choice;

    form: ControlGroup;

    constructor(private _postService: PostService, fb: FormBuilder) {

        this.form = fb.group({
            first_date: ['', Validators.compose([
                Validators.required,
                DateValidators.cannotContainSpace,
                DateValidators.mustBeAValidDate])],
            second_date: ['']
        });

        this.choice = {
            'freq': 'W'
        };


    }

    getNewData() {

        let date1 = this.form.value.first_date;
        let date2 = this.form.value.second_date;
        let frequency = this.choice.freq;

        // Get activity data
        this._postService.getActivityData(date1, date2, frequency).subscribe(data => {


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

        // Get top 10 workspaces data

        this._postService.getTopTenWorkspaces(date1, date2).subscribe(data => {


                let data_workspace_array: any = [];

                for (let key of data) {
                    data_workspace_array.push({
                        workspace: key,
                        value: data[key]
                    });
                }


                console.log(data_workspace_array);

            }
        );


        console.log(this.form.value);
    }

}
