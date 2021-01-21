import { isNull, isUndefined } from 'lodash';
import { BaseEntity, BaseSchemaKeys, BaseStateKeys } from '../../';

export function initialize(e: BaseEntity) {
    const defaultValue: any = e.getSchema().get(BaseSchemaKeys.defaultValue);
    const value: any = e.get(BaseStateKeys.value);

    if (isNull(defaultValue) || isUndefined(defaultValue) || !isNull(value)) {
        return;
    }
    
    e.set(BaseStateKeys.value, defaultValue);
}
