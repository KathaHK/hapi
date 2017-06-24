import * as Mongoose from "mongoose";

declare let __dirname;

/**
 * Creates Type Model
 */
export interface Post extends Mongoose.Document {
    _id: string;
    authorId: string;
    message: string;
    createdAt: Date;
    save: Function;
};

/**
 * Generate Schema for Mongoose
 * @type {Mongoose.Schema}
 * database structure
 */
export const PostSchema = new Mongoose.Schema({
        authorId: { type: String, required: true },
        message: { type: String, required: true },
    },
    {
        timestamps: true
    });


export const PostModel = Mongoose.model<Post>('Post', PostSchema);