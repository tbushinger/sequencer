import { Deserializeable, Disposable, Serializeable } from '../../interfaces';
import { AttributeType } from '../../types/attribute';

export interface AttributeStrategy
    extends Deserializeable,
        Disposable,
        Serializeable {
    set: (name: string, type: AttributeType, value: any) => AttributeStrategy;
    has: (name: string) => boolean;
    get: (name: string) => any | undefined;
    getType: (name: string) => AttributeType | undefined;
}
