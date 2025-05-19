import { Injectable } from "@nestjs/common"


@Injectable()
export class AppService {

    constructor() {}
    getMessage(): string {
        return "this is a message"
    }
}

