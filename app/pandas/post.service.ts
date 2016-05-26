/**
 * Created by imambaks on 4-5-2016.
 */
import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class PostService {

    constructor(private _http: Http) {

    }

    getWorkspaceActivityData(first_date, second_date, freq): any {

        let url: string;
        url = `http://localhost/activity_workspaces?date1=${first_date}&date2=${second_date}&freq=${freq}`;

        console.log(url);
        return this._http.get(url)
            .map(res => res.json());

    }

    getActivityData(first_date, second_date, freq): any {

        let url: string;

        if (freq !== '') {
            url = `http://localhost/activity?date1=${first_date}&date2=${second_date}&freq=${freq}`;
        } else {

            url = `http://localhost/activity?date1=${first_date}&freq=${freq}`;

        }

        return this._http.get(url)
            .map(res => res.json());
    }

    getTopTenWorkspaces(first_date, second_date): any {

        let url: string;

        url = `http://localhost/workspaces?date1=${first_date}&date2=${second_date}`;

        return this._http.get(url)
            .map(res => res.json());

    }

    getTopTenUsers(first_date, second_date): any {

        let url: string;


        url = `http://localhost/users?date1=${first_date}&date2=${second_date}`;

        return this._http.get(url)
            .map(res => res.json());
    }


}
