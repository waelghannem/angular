import { Deserializable } from "./deserializable.model";

export class Address implements Deserializable {
    streetNumber: string;
    streetType: string;
    streetName: string;
    addressComplement: string;
    city: string;
    county: string;
    state: string;
    postalCode: string;
    cedex: string;
    country?: string;
    line: string;
    comment: string;

    
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
      }
}