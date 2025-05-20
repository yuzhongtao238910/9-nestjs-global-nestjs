import { Injectable } from "@nestjs/common";

@Injectable()
export class CoreService {
    constructor() {

    }

    logger(message) {
        console.log("CoreService:" + message)
    }

    demo1() {
        console.log("demo1")
    }
}

