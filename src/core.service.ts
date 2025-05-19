import { Injectable } from "@nestjs/common";

@Injectable()
export class CoreService {
    constructor() {

    }

    loggger(message) {
        console.log("CoreService:" + message)
    }
}

