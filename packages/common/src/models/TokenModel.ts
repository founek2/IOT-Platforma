import mongoose, { Document } from "mongoose";

export enum TokenType {
    forgot_password = "forgot_password",
}

const Schema = mongoose.Schema;

export interface IToken {
    token: string;
    validTo: Date;
    used: boolean;
    type: TokenType;
}

export interface ITokenDocument extends Document, IToken {}

const tokenSchema = new Schema({
    token: { type: String, required: true },
    validTo: { type: Date, required: true },
    used: { type: Boolean, required: true, default: false },
    type: { type: String, required: true, enum: Object.values(TokenType) },
});

export default mongoose.model<ITokenDocument>("Token", tokenSchema);
