/**
 * Created by Katha on 24.06.17.
 */
import * as Hapi from "hapi";
import Routes from "./post.routes";
import { Database } from "../database";
import { ServerConfigurations } from "../configurations";

export function init(server: Hapi.Server, configs: ServerConfigurations, database: Database) {
    Routes(server, configs, database);
}