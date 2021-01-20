import { BaseEntity, BaseSchemaKeys, BaseStateKeys, isNil } from '../../../';

export function validate(
    e: BaseEntity
): void {
    const required: boolean = e.getSchema().get(BaseSchemaKeys.required);
    const value: any = e.get(BaseStateKeys.value);

    let message: string | null = null;
    let valid: boolean = true;

    if (required && isNil(value)) {
        const name = e.getSchema().get(BaseSchemaKeys.name);
        message = `${name} is required.`;
        valid = false;
    }

    e.setMany([
        { path: BaseStateKeys.message, value: message },
        { path: BaseStateKeys.valid, value: valid },
    ]);
}
