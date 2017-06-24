/**
 * Created by Katha on 24.06.17.
 */
import * as Hapi from "hapi";
import * as Joi from "joi";
import * as Path from "path";
import PostController from "./post.controller";
import * as PostValidator from "./post.validator";
import { jwtValidator } from "../users/user.validator";
import { Database } from "../database";
import { ServerConfigurations } from "../configurations";
import * as Configs from "../../src/configurations";

export default function (server: Hapi.Server, configs: ServerConfigurations, database: Database) {

    const postController = new PostController(configs, database);
    server.bind( postController);

    server.route({
        method: 'POST',
        path: '/posts',
        config: {
            handler:  postController.createPost,
            auth: {
                //manges authentication
                strategy: "jwt",
            },
            tags: ['api', 'posts'],
            description: 'Create a new post.',
            validate: {
                payload: PostValidator.createPostModel,
                headers: jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '201': {
                            'description': 'Created a new Post.'
                        },
                        '401': {
                            'description': 'Please login.'
                        }
                    }
                }
            }
        }
    });


    server.route({
        method: 'GET',
        path: '/posts',
        config: {
            handler:  postController.getPosts,
            auth: {
                //manges authentication
                strategy: "jwt",
            },
            tags: ['api', 'posts'],
            description: 'Get all posts.',
            validate: {
                query: {
                    limit: Joi.number().default(50),
                    skip: Joi.number().default(0)
                },
                headers: jwtValidator,
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '201': {
                            'description': 'All posts from your followings and yourself.'
                        },
                        '401': {
                            'description': 'Please login.'
                        }
                    }
                }
            }
        }
    });

}
