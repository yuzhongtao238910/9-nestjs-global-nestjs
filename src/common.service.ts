import { Injectable } from "@nestjs/common";

@Injectable()
export class CommonService {
    logger(message) {
        console.log("CommonService:" + message, "message")
    }
}