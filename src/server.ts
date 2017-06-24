import * as Hapi from "hapi";
import { ServerConfigurations } from "./configurations";
import {HapiPlugin} from "./plugins/interfaces";
import {Database} from "./database";

// Import REST Endpointsets / Features
import * as Users from "./users";

declare let require;

export function init(configs: ServerConfigurations, database: Database) {
    const port = configs.port;
    const server = new Hapi.Server();

    server.connection({
        port: port,
        routes: {
            cors: true
        }
    });

    //  Setup Hapi Plugins
    const plugins: Array<string> = configs.plugins;
    const pluginOptions = {
        database: database,
        serverConfigs: configs
    };

    plugins.forEach((pluginName: string) => {
        let plugin: HapiPlugin = (require("./plugins/" + pluginName)).default();
        console.log(`Register Plugin ${plugin.info().name} v${plugin.info().version}`);
        plugin.register(server, pluginOptions);
    });

    // Init REST Features
    // Tasks.init(server, configs, database);
    // Users.init(server, configs, database);

    return server;
};