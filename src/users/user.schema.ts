import * as Mongoose from "mongoose";
import * as Bcrypt from "bcryptjs";

/**
 * Creates Type Model
 */
export interface User extends Mongoose.Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updateAt: Date;
    scope: [string];
    following: [string];
    validatePassword(requestPassword): boolean;
};

/**
 * Generate Schema for Mongoo
 * @type {Mongoose.Schema}
 */
export const UserSchema = new Mongoose.Schema({
        email: { type: String, unique: true, required: true },
        name: { type: String, required: true },
        password: { type: String, required: true },
        scope: { type: Array, required: false},
        following: { type: Array, required: false}
    },
    {
        timestamps: true
});

/**
 * Hashing password to be not save as clear-text in database
 * @param {String} password
 * @returns {String}
 */
function hashPassword(password: string): string {
    if (!password) {
        return null;
    }
    return Bcrypt.hashSync(password, Bcrypt.genSaltSync(8));
}


// Validate passwort function add to UserSchema
UserSchema.methods.validatePassword = function (requestPassword) {
    return Bcrypt.compareSync(requestPassword, this.password);
};

/**
 * Alters Mongoos Schema.pre()
 * encrypt password after updating
 */
UserSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }

    user.password = hashPassword(user.password);

    return next();
});

/**
 * Alters Mongoos Schema.pre()
 * encrypt password after updating
 */
UserSchema.pre('findOneAndUpdate', function () {
    const password = hashPassword(this.getUpdate().$set.password);

    if (!password) {
        return;
    }

    this.findOneAndUpdate({}, { password: password });
});

export const UserModel = Mongoose.model<User>('User', UserSchema);
