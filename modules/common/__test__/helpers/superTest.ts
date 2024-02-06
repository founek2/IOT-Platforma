import { Express } from "express";
import supertest from "supertest";


// declare module 'supertest' {
//     interface Test {
//         _assert(this: supertest.Test, resError: Error, res: supertest.Response, fn: Function): any
//     }
// }

// Object.defineProperties((supertest as any).Test.prototype, {
//     _assert: {
//         value: (supertest as any).Test.prototype.assert,
//     },
//     assert: {
//         value: function (this: supertest.Test, resError: any, res: any, fn: any): any {
//             // console.log(resError, res?.status)
//             this._assert(resError, res, (err: any, res: any) => {
//                 if (err) {
//                     const originalMessage = err.message;
//                     err.message = `${err.message}\nstatus: ${res?.status}\nresponse: ${JSON.stringify(res.body, null, 2,)}`;
//                     // Must update the stack trace as what supertest prints is the stacktrace
//                     err.stack = err.stack?.replace(originalMessage, err.message);
//                 }
//                 fn.call(this, err, res);
//             });
//         }
//     }
// });

export const server = supertest((global as any).__app as Express)

export function setGlobalApp(app: Express) {
    (global as any).__app = app;
}

export function getGlobalApp(): Express {
    return (global as any).__app;
}