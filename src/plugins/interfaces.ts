import * as Hapi from "hapi";
import { Database } from "../database";
import { ServerConfigurations } from "../configurations";


export interface HapiPluginOptions {
    database: Database;
    serverConfigs: ServerConfigurations;
}

export interface HapiPlugin {
    register(server: Hapi.Server, options?: HapiPluginOptions);
    info(): HapiPluginInfo;
}

export interface HapiPluginInfo {
    name: string;
    version: string;
}