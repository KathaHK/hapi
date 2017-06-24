import * as nconf from "nconf";
import * as path from "path";

declare let __dirname;
declare let process;

const configs = nconf.file("server", path.join(__dirname, `./config.${process.env.NODE_ENV || "dev"}.json`));

export interface ServerConfigurations {
    port: number;
    plugins: Array<string>;
    jwtSecret: string;
    jwtExpiration: string;
}

export interface DataConfiguration {
    connectionString: string;
}

export interface FilesConfiguration {
    storage: string;
}

export function getDatabaseConfig(): DataConfiguration {
    return configs.get("database");
}

export function getServerConfigs(): ServerConfigurations {
    return configs.get("server");
}

export function getFilesConfigs(): FilesConfiguration {
    return configs.get("files");
}