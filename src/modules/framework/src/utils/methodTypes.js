import { not, o } from 'ramda';

export function isGET(req) {
     return req.method === 'GET';
}
export const isNotGET = o(not, isGET);

export function isPOST(req) {
     return req.method === 'POST';
}
export const isNotPOST = o(not, isPOST);

export function isPUT(req) {
     return req.method === 'PUT';
}
export const isNotPUT = o(not, isPUT);

export function isDELETE(req) {
     return req.method === 'DELETE';
}
export const isNotDELETE = o(not, isDELETE);

export function isPATCH(req) {
     return req.method === 'PATCH';
}
export const isNotPATCH = o(not, isPATCH);
