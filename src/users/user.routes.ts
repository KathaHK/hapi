import * as Hapi from "hapi";
import * as Joi from "joi";
import UserController from "./user.controller";
import { UserModel } from "./user.schema";
import * as UserValidator from "./user.validator";
import { Database } from "../database";
import { ServerConfigurations } from "../configurations";

export default function (server: Hapi.Server, serverConfigs: ServerConfigurations, database: Database) {

    const userController = new UserController(serverConfigs, database);
    server.bind(userController);

    server.route({
        method: 'GET',
        path: '/users/info',
        config: {
            handler: userController.infoUser,
            auth: "jwt",
            tags: ['api', 'users'],
            description: 'Get current user info.',
            validate: {
                headers: UserValidator.jwtValidator,
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'User found.'
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
        method: 'DELETE',
        path: '/users',
        config: {
            handler: userController.deleteUser,
            auth: "jwt",
            tags: ['api', 'users'],
            description: 'Delete current user.',
            validate: {
                headers: UserValidator.jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'User deleted.',
                        },
                        '401': {
                            'description': 'User does not have authorization.'
                        }
                    }
                }
            }
        }
    });

    /**
     * Update User by ID in the System
     */
    server.route({
        method: 'DELETE',
        path: '/users/{id}',
        config: {
            handler: userController.deleteUserById,
            auth: {
                strategy: "jwt",
                scope: ["admin"],
            },
            tags: ['api', 'users'],
            description: 'Delete a User (admin)',
            validate: {
                headers: UserValidator.jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'User found.'
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
        method: 'PUT',
        path: '/users',
        config: {
            handler: userController.updateUser,
            auth: "jwt",
            tags: ['api', 'users'],
            description: 'Update current user info.',
            validate: {
                payload: UserValidator.updateUserModel,
                headers: UserValidator.jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Updated info.',
                        },
                        '401': {
                            'description': 'User does not have authorization.'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/users',
        config: {
            handler: userController.createUser,
            tags: ['api', 'users'],
            description: 'Create a user.',
            validate: {
                payload: UserValidator.createUserModel
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '201': {
                            'description': 'User created.'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/users/login',
        config: {
            handler: userController.loginUser,
            tags: ['api', 'users'],
            description: 'Login a user.',
            validate: {
                payload: UserValidator.loginUserModel
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'User logged in.'
                        }
                    }
                }
            }
        }
    });

    /**
     * Get all Users in the System
     */
    server.route({
        method: 'GET',
        path: '/users',
        config: {
            handler: userController.allUser,
            auth: {
                strategy: "jwt",
            },
            tags: ['api', 'users'],
            description: 'Get a full list of users',
            validate: {
                headers: UserValidator.jwtValidator,
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'All Users found.'
                        },
                        '401': {
                            'description': 'Please login.'
                        }
                    }
                }
            }
        }
    });

    /**
     * Load User by ID in the System
     */
    server.route({
        method: 'GET',
        path: '/users/{id}',
        config: {
            handler: userController.getUserById,
            auth: {
                strategy: "jwt",
                scope: ["admin"],
            },
            tags: ['api', 'users'],
            description: 'Get a single user by id (admin)',
            validate: {
                headers: UserValidator.jwtValidator,
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'User found.'
                        },
                        '401': {
                            'description': 'Please login.'
                        }
                    }
                }
            }
        }
    });


    /**
     * Update User by ID in the System
     */
    server.route({
        method: 'PUT',
        path: '/users/{id}',
        config: {
            handler: userController.updateUserById,
            auth: {
                strategy: "jwt",
                scope: ["admin"],
            },
            tags: ['api', 'users'],
            description: 'Update a user (admin).',
            validate: {
                payload: UserValidator.updateUserModelWithScope,
                headers: UserValidator.jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'User updated.'
                        },
                        '401': {
                            'description': 'Please login.'
                        }
                    }
                }
            }
        }
    });

    /**
     * Update User by ID adding a userId to following
     */
    server.route({
        method: 'PUT',
        path: '/users/follow',
        config: {
            handler: userController.updateUserAddFollowing,
            auth: {
                strategy: "jwt",
            },
            tags: ['api', 'users'],
            description: 'Follow a user.',
            validate: {
                payload: UserValidator.updateUserModelFollowing,
                headers: UserValidator.jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Follow a new user.'
                        },
                        '401': {
                            'description': 'Please login.'
                        }
                    }
                }
            }
        }
    });

    /**
     * Update User by ID removing a userId to following
     */
    server.route({
        method: 'PUT',
        path: '/users/unfollow',
        config: {
            handler: userController.updateUserRemoveFollowing,
            auth: {
                strategy: "jwt",
            },
            tags: ['api', 'users'],
            description: 'Unfollow a user.',
            validate: {
                payload: UserValidator.updateUserModelFollowing,
                headers: UserValidator.jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Unfollow an existing user.'
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