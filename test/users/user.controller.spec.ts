import * as chai from "chai";
import UserController from "../../src/users/user.controller";
import { User } from "../../src/users/user.schema";
import * as Configs from "../../src/configurations";
import * as Server from "../../src/server";
import * as Database from "../../src/database";
import * as Utils from "./user.utils";

const configDb = Configs.getDatabaseConfig();
const database = Database.init(configDb);
const assert = chai.assert;
const serverConfig = Configs.getServerConfigs();
const server = Server.init(serverConfig, database);


declare let describe;
declare let it;
declare let beforeEach;
declare let afterEach;

describe("UserController Tests", () => {

    beforeEach((done) => {
        Utils.createSeedUserData(database, done);
    });

    afterEach((done) => {
        Utils.clearDatabase(database, done);
    });

    it("Create user", (done) => {
        var user = {
            email: "user@mail.com",
            name: "John Robot",
            password: "123123"
        };

        server.inject({ method: 'POST', url: '/users', payload: user }, (res) => {
            assert.equal(201, res.statusCode);
            var responseBody: any = JSON.parse(res.payload);
            assert.isNotNull(responseBody.token);
            done();
        });
    });


    it("Create user invalid data", (done) => {
        var user = {
            email: "user",
            name: "John Robot",
            password: "123123"
        };

        server.inject({ method: 'POST', url: '/users', payload: user }, (res) => {
            assert.equal(400, res.statusCode);
            done();
        });
    });


    it("Create user with same email", (done) => {
        server.inject({ method: 'POST', url: '/users', payload: Utils.createUserDummy() }, (res) => {
            assert.equal(500, res.statusCode);
            done();
        });
    });

    it("Get user Info", (done) => {
        var user = Utils.createUserDummy();

        server.inject({ method: 'POST', url: '/users/login', payload: { email: user.email, password: user.password } }, (res) => {
            assert.equal(200, res.statusCode);
            var login: any = JSON.parse(res.payload);

            server.inject({ method: 'GET', url: '/users/info', headers: { "authorization": login.token } }, (res) => {
                assert.equal(200, res.statusCode);
                var responseBody: User = <User>JSON.parse(res.payload);
                assert.equal(user.email, responseBody.email);
                done();
            });
        });
    });


    it("Get User Info Unauthorized", (done) => {
        server.inject({ method: 'GET', url: '/users/info', headers: { "authorization": "dummy token" } }, (res) => {
            assert.equal(401, res.statusCode);
            done();
        });
    });


    it("Delete user", (done) => {
        var user = Utils.createUserDummy();

        server.inject({ method: 'POST', url: '/users/login', payload: { email: user.email, password: user.password } }, (res) => {
            assert.equal(200, res.statusCode);
            var login: any = JSON.parse(res.payload);

            server.inject({ method: 'DELETE', url: '/users', headers: { "authorization": login.token } }, (res) => {
                assert.equal(200, res.statusCode);
                var responseBody: User = <User>JSON.parse(res.payload);
                assert.equal(user.email, responseBody.email);

                database.userModel.findOne({ "email": user.email }).then((deletedUser) => {
                    assert.isNull(deletedUser);
                    done();
                });
            });
        });
    });


    it("Update user info", (done) => {
        var user = Utils.createUserDummy();

        server.inject({ method: 'POST', url: '/users/login', payload: { email: user.email, password: user.password } }, (res) => {
            assert.equal(200, res.statusCode);
            var login: any = JSON.parse(res.payload);
            var updateUser = { name: "New Name" };

            server.inject({ method: 'PUT', url: '/users', payload: updateUser, headers: { "authorization": login.token } }, (res) => {
                assert.equal(200, res.statusCode);
                var responseBody: User = <User>JSON.parse(res.payload);
                assert.equal("New Name", responseBody.name);
                done();
            });
        });
    });


    it("Create user with admin scope should not be possible", (done) => {
        // Create user with admin rights
        var user = {
            email: "admin@server.net",
            name: "John Robot",
            password: "123123",
            scope: ['admin'],
        };

        server.inject({ method: 'POST', url: '/users', payload: user }, (res) => {
            assert.equal(400, res.statusCode);
            done();
        });
    });


    it("List all useres with valid role", (done) => {
        var user = Utils.createUserDummy('admin@mail.com');

        server.inject({ method: 'POST', url: '/users/login', payload: { email: user.email, password: user.password } }, (res) => {
            assert.equal(200, res.statusCode);
            var login: any = JSON.parse(res.payload);

            server.inject({ method: 'GET', url: '/users', headers: { "authorization": login.token } }, (res) => {
                assert.equal(200, res.statusCode);
                done();
            });
        });
    });


    it("List all useres with invalid role", (done) => {
        var user = Utils.createUserDummy('admin@mail.com');

        server.inject({ method: 'POST', url: '/users/login', payload: { email: user.email, password: user.password } }, (res) => {
            assert.equal(200, res.statusCode);
            var login: any = JSON.parse(res.payload);

            server.inject({ method: 'GET', url: '/users', headers: { "authorization": login.token } }, (res) => {
                assert.equal(200, res.statusCode);
                var responseBody: Array<User> = JSON.parse(res.payload);
                assert.equal(responseBody.length, 2);
                done();
            });
        });
    });

    it("Show user by ID with valid role", (done) => {
        // Login as admin
        var user = Utils.createUserDummy('admin@mail.com');

        server.inject({ method: 'POST', url: '/users/login', payload: { email: user.email, password: user.password } }, (res) => {
            assert.equal(200, res.statusCode);
            var login: any = JSON.parse(res.payload);

            // Find other User to show in Database to get _id
            var user_to_find = Utils.createUserDummy();
            database.userModel.findOne({ email: user_to_find.email}).then((dbuser: User) => {
                if (dbuser) {

                    // Get User Information
                    server.inject({ method: 'GET', url: '/users/' + dbuser._id, headers: { "authorization": login.token } }, (res) => {
                        assert.equal(200, res.statusCode);
                        var responseBody: User = <User>JSON.parse(res.payload);
                        assert.equal(dbuser.name, responseBody.name);
                        done();
                    });
                }
            });
        });
    });


    it("Show user by ID with invalid role", (done) => {
        // Login as admin
        var user = Utils.createUserDummy();

        server.inject({ method: 'POST', url: '/users/login', payload: { email: user.email, password: user.password } }, (res) => {
            assert.equal(200, res.statusCode);
            var login: any = JSON.parse(res.payload);

            // Find other User to show in Database to get _id
            var user_to_find = Utils.createUserDummy('admin@mail.com');
            database.userModel.findOne({ email: user_to_find.email}).then((dbuser: User) => {
                if (dbuser) {

                    // Get User Information
                    server.inject({ method: 'GET', url: '/users/' + dbuser._id, headers: { "authorization": login.token } }, (res) => {
                        assert.equal(403, res.statusCode);
                        done();
                    });
                }
            });
        });
    });


    it("Update user by ID with valid role", (done) => {
        // Login as admin
        var user = Utils.createUserDummy('admin@mail.com');

        server.inject({ method: 'POST', url: '/users/login', payload: { email: user.email, password: user.password } }, (res) => {
            assert.equal(200, res.statusCode);
            var login: any = JSON.parse(res.payload);

            // Find other User to show in Database to get _id
            var user_to_update = Utils.createUserDummyWithScope();
            database.userModel.findOne({ email: user_to_update.email}).then((dbuser: User) => {
                if (dbuser) {

                    user_to_update.name = "New Name";
                    user_to_update.scope = ['admin'];
                    // Get User Information
                    server.inject({ method: 'PUT', url: '/users/' + dbuser._id, payload: user_to_update, headers: { "authorization": login.token } }, (res) => {
                        assert.equal(200, res.statusCode);
                        var responseBody: User = <User>JSON.parse(res.payload);
                        assert.equal("New Name", responseBody.name);
                        assert.include(responseBody.scope, 'admin')
                        done();
                    });
                }
            });
        });
    });


    it("Update user by ID with invalid role", (done) => {
        // Login as admin
        var user = Utils.createUserDummy();

        server.inject({ method: 'POST', url: '/users/login', payload: { email: user.email, password: user.password } }, (res) => {
            assert.equal(200, res.statusCode);
            var login: any = JSON.parse(res.payload);

            // Find other User to show in Database to get _id
            var user_to_update = Utils.createUserDummy('admin@mail.com');
            database.userModel.findOne({ email: user_to_update.email}).then((dbuser: User) => {
                if (dbuser) {

                    user_to_update.name = "New Name";
                    // Get User Information
                    server.inject({ method: 'PUT', url: '/users/' + dbuser._id, payload: user_to_update, headers: { "authorization": login.token } }, (res) => {
                        assert.equal(403, res.statusCode);
                        done();
                    });
                }
            });
        });
    });

    it("Delete user by ID with valid role", (done) => {
        // Login as admin
        var user = Utils.createUserDummy('admin@mail.com');

        server.inject({ method: 'POST', url: '/users/login', payload: { email: user.email, password: user.password } }, (res) => {
            assert.equal(200, res.statusCode);
            var login: any = JSON.parse(res.payload);

            // Find other User to show in Database to get _id
            var user_to_update = Utils.createUserDummy();
            database.userModel.findOne({ email: user_to_update.email}).then((dbuser: User) => {
                if (dbuser) {

                    // Get User Information
                    server.inject({ method: 'DELETE', url: '/users/' + dbuser._id, headers: { "authorization": login.token } }, (res) => {
                        assert.equal(200, res.statusCode);
                        var responseBody: User = <User>JSON.parse(res.payload);
                        assert.equal(dbuser.email, responseBody.email);

                        database.userModel.findOne({ "email": dbuser.email }).then((deletedUser) => {
                            assert.isNull(deletedUser);
                            done();
                        });
                    });
                }
            });
        });
    });


    it("Delete user by ID with invalid role", (done) => {
        // Login as admin
        var user = Utils.createUserDummy();

        server.inject({ method: 'POST', url: '/users/login', payload: { email: user.email, password: user.password } }, (res) => {
            assert.equal(200, res.statusCode);
            var login: any = JSON.parse(res.payload);

            // Find other User to show in Database to get _id
            var user_to_update = Utils.createUserDummy('admin@mail.com');
            database.userModel.findOne({ email: user_to_update.email}).then((dbuser: User) => {
                if (dbuser) {
                    // Get User Information
                    server.inject({ method: 'DELETE', url: '/users/' + dbuser._id, payload: user_to_update, headers: { "authorization": login.token } }, (res) => {
                        assert.equal(403, res.statusCode);
                        done();
                    });
                }
            });

        });
    });

});
