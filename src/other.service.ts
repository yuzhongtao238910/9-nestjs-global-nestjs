import { Injectable } from "@nestjs/common";

@Injectable()
export class OtherService {
    logger(message) {
        console.log("OtherService:" + message, "message")
    }
}
