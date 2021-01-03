import { Path } from '../types/path';

export interface Readable {
    get: (path: Path) => any;
}
