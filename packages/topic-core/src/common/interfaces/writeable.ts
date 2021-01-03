import { Path } from '../types/path';

export interface Writeable {
    set: (path: Path, value: any) => any;
}
