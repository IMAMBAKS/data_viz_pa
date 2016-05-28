import {Component} from '@angular/core';
import {BarChartDirective} from '../bar-chart/bar-chart.directive';
import {PostService} from './post.service';
import {ControlGroup, FormBuilder, Validators} from '@angular/common';
import {DateValidators} from './dateValidators';
import {HorizontalBarChartDirective} from '../horizontal-bar-chart/horizontal-bar-chart.directive';
import {LineChartDirective} from '../line-chart/line-chart.directive';
declare let d3;

@Component({
    selector: 'pandas',
    templateUrl: 'app/pandas/pandas.component.html',
    directives: [BarChartDirective, HorizontalBarChartDirective, LineChartDirective],
    providers: [PostService]
})


export class PandasComponent {

    // Define variables
    timeData: any;
    choice;
    hdata;
    barData;
    userData;
    workspaceTimeData;

    // Define a form variable
    form: ControlGroup;

    constructor(private _postService: PostService, fb: FormBuilder) {

        // Created the form variables/validators
        this.form = fb.group({
            first_date: ['', Validators.compose([
                Validators.required,
                DateValidators.cannotContainSpace,
                DateValidators.mustBeAValidDate])],
            second_date: ['', Validators.compose([
                DateValidators.mustBeAValidDateOrEmpty])]
        });

        this.choice = {
            'freq': 'W'
        };

        this.barData = '';


    }

    readBarData($event) {

        this.barData = $event.newValue;

    }

    // Retrieve data from the server
    getNewData() {

        // Retrieve form values
        let date1 = this.form.value.first_date;
        let date2 = this.form.value.second_date;
        let frequency = this.choice.freq;

        // Get activity data
        this._postService.getActivityData(date1, date2, frequency).subscribe(data => {


            let data_transformed_array: any = [];

            for (let key in data) {

                if (data.hasOwnProperty(key)) {

                    data_transformed_array.push({
                        _value: data[key].length,
                        date: new Date(+ key),
                        names: (data[key])
                    });
                }
            }


            this.timeData = data_transformed_array;
        });


        // Get workspace activity lines data
        this._postService.getWorkspaceActivityData(date1, date2, frequency).subscribe(
            data => {


                data.forEach(function (d) {
                    d.date = new Date(+ d.date);
                });

                let nested_data = d3.nest()
                    .key(d => d.workspace_name)
                    .entries(data);
                this.workspaceTimeData = nested_data;


            }
        );


        // Get top 10 workspaces data
        this._postService.getTopTenWorkspaces(date1, date2).subscribe(data => {


            let data_workspace_array: any = [];

            for (let key in data) {

                if (data.hasOwnProperty(key)) {
                    data_workspace_array.push({
                        workspace: key,
                        value: data[key]
                    });

                }
            }


            this.hdata = data_workspace_array;


        });
        this._postService.getTopTenUsers(date1, date2).subscribe(data => {


                let data_workspace_array: any = [];

                for (let key in data) {

                    if (data.hasOwnProperty(key)) {
                        data_workspace_array.push({
                            workspace: key,
                            value: data[key]
                        });

                    }
                }


                this.userData = data_workspace_array;


            }
        );


    }

}
