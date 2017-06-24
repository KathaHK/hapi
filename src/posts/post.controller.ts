/**
 * Created by Katha on 24.06.17.
 */

import * as Hapi from "hapi";
import * as Boom from "boom";
import * as Path from "path";
import { Post, PostModel } from "./post.schema";
import {User} from "../users/user.schema";
import { Database } from "../database";
import {ServerConfigurations} from "../configurations";
import * as Configs from "../configurations";

export default class PostController {

    private database: Database;
    private configs: ServerConfigurations;


    constructor(configs: ServerConfigurations, database: Database) {
        this.configs = configs;
        this.database = database;
    }

    public createPost(request: Hapi.Request, reply: Hapi.IReply) {
        let newPost: Post = request.payload;

        newPost.authorId = request.auth.credentials.id;

        this.database.postModel.create(newPost).then((post) => {
            post.save();
            reply(post).code(201);
        }).catch((error) => {
            reply(Boom.badImplementation(error));
        });
    }

    public getPosts(request: Hapi.Request, reply: Hapi.IReply) {
        let limit = request.query.limit;
        let skip = request.query.skip;

        const id = request.auth.credentials.id;


        this.database.userModel.findById(id)
            .then((loadedUser: User) => {

                //save the user I follow in an array and add my id to the array
                var authorList = loadedUser.following;
                authorList.push(id);

                // show my posts and posts from user I follow
                this.database.postModel.find({ 'authorId': { $in: authorList }}, '_id authorId message').lean(true).skip(skip).limit(limit).then((posts: Array<Post>) => {
                    reply(posts);
                }).catch((error) => {
                    reply(Boom.badImplementation(error));
                });
            })
            .catch((error) => {
                reply(Boom.badImplementation(error));
            });



    }

}