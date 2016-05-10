import {Component} from "@angular/core";
import {BarChartDirective} from "../bar-chart/bar-chart.directive";
import {PostService} from "./post.service";
import {ControlGroup, FormBuilder, Validators} from "@angular/common";
import {DateValidators} from "./dateValidators";

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


    }

    getNewData() {

        let date1 = this.form.value.first_date;
        let date2 = this.form.value.second_date;
        let frequency = this.choice;

        this._postService.getPost(date1, date2, frequency).subscribe(data => {


            data.author = JSON.parse(data.author);


            let data_transform_array: any = [];

            for (let key in data.author) {

                if (data.author.hasOwnProperty(key)) {

                    data_transform_array.push({
                        _value: data.author[key].length,
                        date: new Date(+ key),
                        names: (data.author[key])
                    });
                }
            }


            this.bmai = data_transform_array;
        });


        console.log(this.form.value);
    }

}
