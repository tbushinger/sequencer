export type AttributeType = "string" | "number" | "boolean" | "any";

export type Attribute = {
    type: AttributeType;
    value: any;
}

export type Attributes = {
    [name: string]: Attribute;
}