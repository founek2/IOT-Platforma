/**
 * Separated for usage in backend
 */
export const groupsHeritage = {
    root: ['user', 'admin'],
    admin: ['user']
};

export const allowedGroups = {
    user: [{ name: "user", text: "Uživatel" }],
    admin: [{ name: 'user', text: 'Uživatel' }, { name: 'admin', text: 'správce' }],
    root: [{ name: 'root', text: 'root' }],
}