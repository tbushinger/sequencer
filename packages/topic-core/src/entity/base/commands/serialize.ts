import { BaseEntity } from '../../';

export function serialize(e: BaseEntity): any {
    return (): any => {
        return {
            schema: e.getSchema().serialize(),
            state: e.getState().serialize(),
        }
    };
}
