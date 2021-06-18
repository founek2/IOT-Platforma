declare module '@date-io/type' {
    export type DateType = Date;
}

declare module 'node-dotify' {
    function dotify(deepObj: {}): {};
    export = dotify;
}
