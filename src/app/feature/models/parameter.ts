import { Deserializable } from "./deserializable.model";

export class Parameter implements Deserializable {
    local?: string;
    datePattern?: string;
    selectedTheme?: string;
  deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
