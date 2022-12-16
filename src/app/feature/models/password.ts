import { Deserializable } from "./deserializable.model";

export class Password implements Deserializable {
    oldPassword: string;
    newPassword: string;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }

}