import * as Server from "./server";
import * as Database from "./database";
import * as Configs from "./configurations";

declare let process;
declare let require;

console.log(`Running enviroment ${process.env.NODE_ENV || "dev"}`);

// Init Database
const dbConfigs = Configs.getDatabaseConfig();
const database = Database.init(dbConfigs);

// Starting Application Server
const serverConfigs = Configs.getServerConfigs();
const server = Server.init(serverConfigs, database);

// include the components
// this happens via jwt-auth under plugins/jwt-auth/index.ts


server.start(() => {
    console.log("Server running at:", server.info.uri);
});