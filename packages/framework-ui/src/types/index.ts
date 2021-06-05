export type errorMessage = string;

export type validationFn = (value: any, options?: any) => true | errorMessage;

export type messages = { [messageKey: string]: ((args: any) => string) | string };

export type fieldDescriptor = {
    deepPath: string;
    required?: boolean;
    when?: ((formData: any, options: { deepPath: string; i?: number }) => boolean) | null;
    getLength?: ((formData: any) => number | undefined) | null | undefined; // just when deepPath ends with [] -> will be array of fields
    label?: string | null | undefined;
    name?: string | null | undefined;
    validations?: Array<validationFn>;
};

export type fieldState = {
    pristine?: boolean;
    valid?: boolean;
    errorMessages?: Array<string>;
};

export type fieldDescriptors = { [key: string]: fieldDescriptors | fieldDescriptor };

export type ValueOf<T> = T[keyof T];
