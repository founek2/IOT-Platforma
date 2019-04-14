import bcrypt from 'bcrypt';

export function createHash(plainText) {
	return bcrypt.hash(plainText, 10)
}

export function compare(plainText, hash) {
	return  bcrypt.compare(plainText, hash);
}