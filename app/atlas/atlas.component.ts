import {Component, OnInit} from '@angular/core';
import {AtlasService} from './atlas.service';


@Component({
    selector: 'atlas',
    templateUrl: 'app/atlas/atlas.component.html',
    providers: [AtlasService]
})

export class AtlasComponent implements OnInit {

    data = {};

    ngOnInit(): any {
        this._atlasService.getDataFromAtlas1().subscribe(data => console.log(data));
        this._atlasService.getDataFromAtlas2().subscribe(data => data.forEach(d => {
            data[d.origin_id] = {
                export_val_2010: d.export_val,
                id: d.origin_id
            };
        }));
    }

    btnClk() {
        console.log(this.data);
    }

    constructor(private _atlasService: AtlasService) {

    }


}

