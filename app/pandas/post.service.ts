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

    getPost(): any {


        // let headers = new Headers({
        //     'access-control-request-method': 'GET'
        // });
        //
        // let options = new RequestOptions({
        //     headers: headers
        // });


        return this._http.get('http://localhost/quote')
            .map(res => res.json());
    }
}
