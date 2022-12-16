import { Deserializable } from "./deserializable.model";
import { Location } from "./location";

export class Group {
    id: string;

    name: string;

    code: string;

    vat: string;

    registration: string;

    duns: string;

    fullname: string;

    creation: Date;

    modification: Date;

    comment: string;

    description: string;


    location: Location

    logoSmal: [];

    logoMedium: [];

    logoLarge: [];

    freeText01: string;

    freeText02: string;

    freeText03: string;

    freeText04: string;

    freeText05: string;

    freeText06: string;

    freeText07: string;

    freeText08: string;

    freeText09: string;

    freeLongText01: string;

    freeLongText02: string;

    freeBoolean01: string;

    freeBoolean02: string;

    freeDouble01: string;

    freeDate01: Date;

    freeDate02: Date;

    registeredName: string;

    shareCapital: string;

    legalStructure: string;

    freeViewConfiguration: string;

    freeViewProfile: string;

}
