import 'rxjs/add/operator/map';
import {Http} from '@angular/http';
import {Injectable} from '@angular/core';

@Injectable()
export class AtlasService {

    url1: string;
    url2: string;

    constructor(private _http: Http) {

    }

    getDataFromAtlas1() {

        this.url1 = 'http://atlas.media.mit.edu/hs/export/2010/show/all/all/';

        return this._http.get(this.url1)
            .map(res => res.json());
    }

    getDataFromAtlas2() {

        this.url2 = 'http://atlas.media.mit.edu/hs/export/2011/show/all/all/';

        return this._http.get(this.url2)
            .map(res => res.json());
    }


}
