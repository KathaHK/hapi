import * as Mongoose from "mongoose";
import { DataConfiguration } from "./configurations";
import {User, UserModel} from "./users/user.schema";
import {Post, PostModel} from "./posts/post.schema";


export interface Database {
    userModel: Mongoose.Model<User>;
    postModel: Mongoose.Model<Post>;
}

export function init(config: DataConfiguration) {

    (<any>Mongoose).Promise = Promise;
    Mongoose.connect(config.connectionString);

    console.log("ConnectionString: ", config.connectionString);

    let mongoDb = Mongoose.connection;

    mongoDb.on("error", () => {
        console.log(`Unable to connect to database: ${config.connectionString}`);
    });

    mongoDb.once("open", () => {
        console.log(`Connected to database: ${config.connectionString}`);
    });

    return {
        postModel: PostModel,
        userModel: UserModel
    };
}