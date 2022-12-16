import { Deserializable } from "./deserializable.model";
import { Group } from "./group";

export class Organization extends Group {
    collaborativeId: string;
    subscriberId: string;
    phone: string;
    fax: string;
    email: string;
    web: string;
    orderContact: string;
    orderPhone: string;
    orderFax: string;
    orderEmail: string;
    client: boolean;
    gs1: string;
    extension: string;
    serialReference: string;
    autoGenerationOfSSCC: boolean;
}