/**
 * Separated for usage in backend
 */

import { append } from 'ramda';

const adminAllowedGroups = [
    { name: 'user', text: 'uživatel' },
    { name: 'admin', text: 'správce' },
    { name: 'flow', text: 'flow' },
];

export const allowedGroups = {
    user: { allowedGroups: [{ name: 'user', text: 'Uživatel' }] },
    admin: {
        allowedGroups: adminAllowedGroups,
    },
    root: { allowedGroups: append({ name: 'root', text: 'root' }, adminAllowedGroups) },
    flow: { allowedGroups: [] },
};
