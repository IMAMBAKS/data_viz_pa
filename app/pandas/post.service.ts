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

    getPost(first_date, second_date, freq): any {


        // let headers = new Headers({
        //     'access-control-request-method': 'GET'
        // });
        //
        // let options = new RequestOptions({
        //     headers: headers
        // });

        let url: string;

        if (freq !== '') {
            url = `http://localhost/quote?date1=${first_date}&date2=${second_date}&freq=${freq}`;
        } else {

            url = `http://localhost/quote?date1=${first_date}&freq=${freq}`;

        }

        console.log(url);


        return this._http.get(url)
            .map(res => res.json());
    }
}
