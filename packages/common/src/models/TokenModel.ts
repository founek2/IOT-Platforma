import mongoose, { Document } from 'mongoose'

export enum TokenType {
    FORGOT_PASSWORD
}

const Schema = mongoose.Schema

export interface IToken extends Document {
    token: string;
    validTo: Date;
    used: boolean;
    type: TokenType
}


const tokenSchema = new Schema(
    {
        token: { type: String, required: true },
        validTo: { type: Date, required: true },
        used: { type: Boolean, required: true, default: false },
        type: { type: String, required: true, enum: Object.values(TokenType) }
    })


export default mongoose.model<IToken>('Token', tokenSchema)

