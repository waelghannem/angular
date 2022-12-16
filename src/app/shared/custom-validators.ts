import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import moment from 'moment';

export class CustomValidators {

  static isNumber(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== undefined && (isNaN(control.value))) {
            return { 'isNumber': true };
        }
        return null;
    };
  }
  static isNumberLessThan(max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== undefined && (isNaN(control.value) || control.value > max)) {
            return { 'isNumberInRange': true };
        }
        return null;
    };
  }

  static isNumberGreaterThan(min: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== undefined && (isNaN(control.value) || control.value < min)) {
            return { 'isNumberInRange': true };
        }
        return null;
    };
  }
  static isNumberInRange(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== undefined && (isNaN(control.value) || control.value < min || control.value > max)) {
            return { 'isNumberInRange': true };
        }
        return null;
    };
  }

  static maxLength(max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== undefined && (control.value.length > max)) {
            return { 'maxLength': true };
        }
        return null;
    };
  }

  static minLength(min: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== undefined && (control.value.length < min)) {
            return { 'maxLength': true };
        }
        return null;
    };
  }

  static lengthBetween(min:number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== undefined && (control.value.length > max || control.value.length < min)) {
            return { 'maxLength': true };
        }
        return null;
    };
  }

  static exactValue(value: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && (control.value.length !== value && control.value.length !== 0)) {
        return { 'exactValue': true };
      }
      return null;
    }
  }


  static isNumberInRangeOrNull(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== undefined && ((isNaN(control.value) || control.value < min || control.value > max ) && control.value.length !== 0) ) {
            return { 'isNumberInRange': true };
        }
        return null;
    };
  }

  static isNumberInRangeWithExactLengthOrNull(min: number, max: number, length: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && ((isNaN(control.value) || control.value < min || control.value > max || control.value.length !== length ) && control.value.length !== 0) ) {
        return { 'InRangeWithExactLength': true };
        }
        return null;
    };
  }

  static ptDate(control: FormControl): { [key: string]: any } | null {
    let ptDatePattern =  /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g;

    if (control.value && !control.value.match(ptDatePattern))
        return { "ptDate": true };

    return null;
  }

  static isEmpty(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== undefined && control.value.length === 0) {
            return { 'isEmpty': true };
        }
        return null;
    };
  }

  static date(format: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } |  null => {
      if (control.value !== undefined && control.value !== '' && !moment(control.value, format, true).isValid()) {
        return { 'date': true };
      }
      return null;
    };
  }

  static mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          // return if another validator has already found an error on the matchingControl
          return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
      } else {
          matchingControl.setErrors(null);
      }
    }
  }

  static url(): ValidatorFn {
    const regex = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '[a-z\\d]+|'+ // server name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return Validators.pattern(regex);
  }

  static time(): ValidatorFn {
    const regex = new RegExp('^[0-9]+(s|M|H)*$','i'); // fragment locator
    return Validators.pattern(regex);
  }

  static phoneNumber(countryPhoneCode = '*'): ValidatorFn {
    return Validators.pattern('([+]'+ countryPhoneCode + ')?([0-9]{10,12})$');
  }

  static isValidField(form: FormGroup, fieldName: string): boolean | undefined {
    return form.get(fieldName)?.valid &&
    (form.get(fieldName)?.dirty || form.get(fieldName)?.touched)
  }

  static isInvalidField(form: FormGroup, fieldName: string, submitted: boolean): boolean | undefined {
    return submitted && form.get(fieldName)?.invalid &&
    (form.get(fieldName)?.dirty || form.get(fieldName)?.touched)
  }

  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }

  static formControlIsRequired(formGroup: FormGroup, control: string): boolean {
    return !!formGroup.controls[control].hasValidator(Validators.required)
  }

}

