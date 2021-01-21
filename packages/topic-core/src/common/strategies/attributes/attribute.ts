import {
    AttributeType,
    BulkWriteable,
    Deserializeable,
    Disposable,
    Observable,
    Path,
    Readable,
    Serializeable,
    Writeable,
} from '../../';

export interface AttributeStrategy
    extends BulkWriteable,
        Deserializeable,
        Disposable,
        Observable,
        Readable,
        Serializeable,
        Writeable {
    setWithType: (name: Path, type: AttributeType, value: any) => void;
    has: (name: Path) => boolean;
    getType: (name: Path) => AttributeType | undefined;
    enableEvents: (enable: boolean) => void;
}
