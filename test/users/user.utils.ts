import * as Database from "../../src/database";


export function createUserDummy(email?: string) {
    var user = {
        email: email || "dummy@mail.com",
        name: "Dummy Jones",
        password: "123123",
    };

    return user;
}

export function createUserDummyWithScope(email?: string, scope?: Array<String>) {
    var user = {
        email: email || "dummy@mail.com",
        name: "Dummy Jones",
        password: "123123",
        scope: scope || [],
    };

    return user;
}


export function clearDatabase(database: Database.Database, done: any) {
    var promiseUser = database.userModel.remove({});

    Promise.all([promiseUser]).then(() => {
        done();
    }).catch((error) => {
        console.log(error);
    });
}

export function createSeedUserData(database: Database.Database, done: any) {
    database.userModel.create([createUserDummy(), createUserDummyWithScope('admin@mail.com', ['admin'])])
        .then((user) => {
            done();
        })
        .catch((error) => {
            console.log(error);
        });
}

