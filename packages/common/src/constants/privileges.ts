/**
 * Separated for usage in backend
 */
export const groupsHeritage = {
    root: ['user', 'admin', 'flow'],
    admin: ['user', 'flow'],
};

export const allowedGroups = {
    user: [{ name: 'user', text: 'Uživatel' }],
    admin: [
        { name: 'user', text: 'Uživatel' },
        { name: 'admin', text: 'správce' },
        { name: 'flow', text: 'flow' },
    ],
    root: [{ name: 'root', text: 'root' }],
};
