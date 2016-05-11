import {Control} from '@angular/common';


export class DateValidators {
    static cannotContainSpace(control: Control) {
        if (control.value.indexOf(' ') >= 0) {
            return {cannotContainSpace: true};
        }

        return null;
    }

    static mustBeAValidDate(control: Control) {

        if (/^(201([3-7]))(-(0?[1-9]|1[0-2]))?(-(0[1-9]|1[1-9]|2[1-9]|30))?$/.test(control.value)) {
            return null;
        }

        return {mustBeAValidDate: true};


    }


}
