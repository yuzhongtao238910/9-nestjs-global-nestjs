import { Inject, Injectable } from "@nestjs/common"
import type { Config } from "./dynamicConfig.module"

@Injectable()
export class AppService {

    constructor(
        @Inject("CONFIG") private readonly config: Config,
        @Inject("PREFIX") private readonly prefix: string
    ) {}
    getMessage(): string {
        return "this is a message"
    }


    getConfig() {
        console.log(this.prefix, "prefix")
        return this.config
    }
}

