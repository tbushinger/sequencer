// TODO: move to helper
import { isNull, isUndefined } from "lodash";

export function isNil(value: any): boolean {
    return isNull(value) || isUndefined(value);
}