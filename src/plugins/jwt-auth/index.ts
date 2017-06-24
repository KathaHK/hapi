import { HapiPlugin, HapiPluginOptions } from "../interfaces";
import * as Hapi from "hapi";
import { User, UserModel } from "../../users/user.schema";
import * as HapiAuthJwt2 from "hapi-auth-jwt2";
import * as Users from "../../users";
import * as Posts from "../../posts";



export default (): HapiPlugin => {
    return {
        register: (server: Hapi.Server, options: HapiPluginOptions) => {
            const database = options.database;
            const serverConfig = options.serverConfigs;

            const validateUser = (decoded, request, cb) => {
                database.userModel.findById(decoded.id).lean(true)
                    .then((user: User) => {
                        if (!user) {
                            return cb(null, false);
                        }

                        return cb(null, true);
                    });
            };

            server.register(HapiAuthJwt2, (error) => {
                if (error) {
                    console.log('error', error);
                } else {
                    server.auth.strategy('jwt', 'jwt',
                        {
                            key: serverConfig.jwtSecret,
                            validateFunc: validateUser,
                            verifyOptions: { algorithms: ['HS256'] }
                        });


                    Users.init(server, serverConfig, database);
                    Posts.init(server, serverConfig, database);
                }
            });
        },
        info: () => {
            return {
                name: "JWT Authentication",
                version: "1.0.0"
            };
        }
    };
};


