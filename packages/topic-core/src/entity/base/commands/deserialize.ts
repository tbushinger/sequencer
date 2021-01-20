import { BaseEntity } from '../../';

export function deserialize(e: BaseEntity): any {
    return (payload: any): void => {
        if (payload.schema) {
            e.getSchema().deserialize(payload.schema);
        }

        if (payload.state) {
            e.getState().deserialize(payload.state);
        }
    };
}
