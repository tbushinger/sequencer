import {
    AttributeType,
    Deserializeable,
    Disposable,
    Observable,
    Serializeable,
} from '../../';

export interface AttributeStrategy
    extends Deserializeable,
        Disposable,
        Observable,
        Serializeable {
    set: (name: string, type: AttributeType, value: any) => void;
    has: (name: string) => boolean;
    get: (name: string) => any | undefined;
    getType: (name: string) => AttributeType | undefined;
}
