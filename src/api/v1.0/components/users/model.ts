import mongoose, { Model } from "mongoose";

import { emailRegex, fullNameRegex } from "$config/global";

interface VaultObject {
  passwords: {}
  notes: {}
  documents: {}
}

/**
 * The User Schema in MongoDB
 */
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: emailRegex
    },
    verified: {
        type: Boolean,
        requierd: true
    },
    emailVerificationToken: {
        type: String,
        unique: true,
        sparse: true
    },
    twoFactorAuthenticationToken: {
        type: String,
        required: false
    },
    vaultKey: {
        type: String,
        required: true
    },
    reminder: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true,
        match: fullNameRegex
    },
    phone: {
        type: String,
        required: false
    },
    phoneVerified: {
        type: Boolean,
        required: false
    },
    phoneVerificationCode: {
        type: Number,
        required: false
    },
    vault: {
        type: Object,
        required: true,
        default: {
          passwords: {},
          notes: {},
          documents: {}
        },
    },
    permissionLevel: {
        type: Number,
        required: true
    }
}, {minimize: false, timestamps: true});

/**
 * An interface with the same properties as the Schema to refer to the user
 */
export interface IUser extends mongoose.Document {
    email?: String,
    verified?: Boolean,
    emailVerificationToken?: String,
    twoFactorAuthenticationToken?: String,
    vaultKey?: String,
    name?: String,
    phone?: String,
    phoneVerified?: Boolean,
    phoneVerificationCode?: Number,
    vault?: VaultObject,
    permissionLevel?: Number,
    reminder?: String,
    createdAt?: Date,
    modifiedAt?: Date
}

export default mongoose.model("User", userSchema, "users");