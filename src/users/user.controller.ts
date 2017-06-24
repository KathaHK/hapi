import * as Hapi from "hapi";
import * as Boom from "boom";
import * as Jwt from "jsonwebtoken";
import {User} from "./user.schema";
import {UserModel} from "./user.schema";
import { Database } from "../database";
import { ServerConfigurations } from "../configurations";


export default class UserController {

    private database: Database;
    private configs: ServerConfigurations;

    /**
     * constructor.
     * @constructor
     * @param configs ServerConfigurations
     * @param database Database
     */
    constructor(configs: ServerConfigurations, database: Database) {
        this.database = database;
        this.configs = configs;
    }

    /**
     * Generate a auth token.
     * @param user
     * @returns {PromiseLike<ArrayBuffer>|number}
     */
    private generateToken(user: User) {
        const jwtSecret = this.configs.jwtSecret;
        const jwtExpiration = this.configs.jwtExpiration;
        return Jwt.sign({ id: user._id, scope: user.scope,  email: user.email }, jwtSecret, { expiresIn: jwtExpiration });
    }

    /**
     * Login user
     * @param request
     * @param reply
     */
    public loginUser(request: Hapi.Request, reply: Hapi.IReply) {
        const email = request.payload.email;
        const password = request.payload.password;

        this.database.userModel.findOne({ email: email })
            .then((user: User) => {
                if (!user) {
                    return reply(Boom.unauthorized("User does not exists."));
                }

                if (!user.validatePassword(password)) {
                    return reply(Boom.unauthorized("Password is invalid."));
                }
                const token = this.generateToken(user);

                reply({
                    token: token
                });
            })
            .catch((error) => {
                reply(Boom.badImplementation(error));
            });
    }

    public createUser(request: Hapi.Request, reply: Hapi.IReply) {
        const user: User = request.payload;

        this.database.userModel.create(user).then((user) => {
            const token = this.generateToken(user);
            reply({ token: token }).code(201);
        })
            .catch((error) => {
                reply(Boom.badImplementation(error));
            });
    }

    public updateUser(request: Hapi.Request, reply: Hapi.IReply) {
        const id = request.auth.credentials.id;
        const user: User = request.payload;

        this.database.userModel.findByIdAndUpdate(id, { $set: user }, { new: true })
            .then((user) => {
                reply(user);
            })
            .catch((error) => {
                reply(Boom.badImplementation(error));
            });
    }

    public updateUserById(request: Hapi.Request, reply: Hapi.IReply) {
        const id = request.params.id;
        const user: User = request.payload;

        this.database.userModel.findByIdAndUpdate(id, { $set: user }, { new: true })
            .then((user) => {
                reply(user);
            })
            .catch((error) => {
                reply(Boom.badImplementation(error));
            });
    }


    public deleteUser(request: Hapi.Request, reply: Hapi.IReply) {
        const id = request.auth.credentials.id;

        this.database.userModel.findByIdAndRemove(id)
            .then((user: User) => {
                reply(user);
            })
            .catch((error) => {
                reply(Boom.badImplementation(error));
            });
    }

    public deleteUserById(request: Hapi.Request, reply: Hapi.IReply) {
        const id = request.params.id;

        this.database.userModel.findByIdAndRemove(id)
            .then((user: User) => {
                reply(user);
            })
            .catch((error) => {
                reply(Boom.badImplementation(error));
            });
    }


    public infoUser(request: Hapi.Request, reply: Hapi.IReply) {
        const id = request.auth.credentials.id;

        this.database.userModel.findById(id)
            .then((user: User) => {
                reply(user);
            })
            .catch((error) => {
                reply(Boom.badImplementation(error));
            });
    }


    public allUser(request: Hapi.Request, reply: Hapi.IReply) {

        this.database.userModel.find({})
            .then((user: User) => {
                reply(user);
            })
            .catch((error) => {
                reply(Boom.badImplementation(error));
            });
    }

    public getUserById(request: Hapi.Request, reply: Hapi.IReply) {
        const id = request.params.id;

        this.database.userModel.findById(id)
            .then((user: User) => {
                reply(user);
            })
            .catch((error) => {
                reply(Boom.badImplementation(error));
            });
    }

    public updateUserAddFollowing(request: Hapi.Request, reply: Hapi.IReply) {
        console.log("Payload", request.payload);
        const userToFollowId:string = request.payload.following;
        const id = request.auth.credentials.id;
        this.database.userModel.findById(id)
            .then((loadedUser: User) => {

                var user = {
                    following: loadedUser.following,
                }

                if(user.following.indexOf(userToFollowId) === -1) {
                    user.following.push(userToFollowId);
                }


                // Update User
                this.database.userModel.findByIdAndUpdate(id, { $set: user }, { new: true })
                    .then((user) => {
                        reply(user);
                    })
                    .catch((error) => {
                        reply(Boom.badImplementation(error));
                    });
            })
            .catch((error) => {
                reply(Boom.badImplementation(error));
            });
    }

    public updateUserRemoveFollowing(request: Hapi.Request, reply: Hapi.IReply) {
        const userToUnfollowId:string = request.payload.following;
        const id = request.auth.credentials.id;
        this.database.userModel.findById(id)
            .then((loadedUser: User) => {

                var user = {
                    following: loadedUser.following,
                }

                // search the array user.following if usertoUnfollowId is in array, if yes, save position of the item in index, else -1
                var index =  user.following.indexOf(userToUnfollowId);
                if(index >= 0) {
                    user.following.splice(index, 1);
                }


                // Update User
                this.database.userModel.findByIdAndUpdate(id, { $set: user }, { new: true })
                    .then((user) => {
                        reply(user);
                    })
                    .catch((error) => {
                        reply(Boom.badImplementation(error));
                    });
            })
            .catch((error) => {
                reply(Boom.badImplementation(error));
            });
    }

}