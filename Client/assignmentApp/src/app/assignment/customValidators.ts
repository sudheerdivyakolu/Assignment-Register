import { AbstractControl } from "@angular/forms";

export class customValidator {

    static validateStartDate(control: AbstractControl) {

        const date = control.value;

        if (date < new Date(new Date().setDate(new Date().getDate() - 1))) {
            return {
                invalidStartDate: true
            }
        }
        return null;
    }
    static validateEndDate(control: AbstractControl) {

        const date = control.value;

        if (date < new Date(new Date().setDate(new Date().getDate() - 1))) {
            return {
                invalidEndDate: true
            }
        }
        return null;
    }
}