import {Deserializable} from "./deserializable.model";
import {Location} from "./location";
import {Group} from "./group";

export class ProfileUser implements Deserializable {
  loginDate?: Date;
  creation?: Date;
  modification?: Date;
  login?: string;
  password?: string;
  loginCount?: number;
  firstname?: string;
  lastname?: string;
  fullname?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  icon?: string;
  comment?: string;
  locale?: string;
  datePattern?: string;
  selectedTheme?: string;
  inetAddress?: string;
  gender?: Gender;
  locations?: Location[];
  languages?: language[];
  dateFormats: string[];
  primaryGroup: Group;
  isParnter:boolean;
  passwordPattern: string;
  passwordMessage: string;


  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}

enum Gender {
  MALE,
  FEMALE
}

interface language {
  disabled: boolean,
  label: string,
  value: string,
  noSelectionOption: boolean
}
