import { AttributeType, Path } from '../types';

export type BulkItem = {
    path: Path;
    value: any;
    type?: AttributeType;
};

export type BulkItems = BulkItem[];

export interface BulkWriteable {
    setMany: (items: BulkItems) => void;
}
