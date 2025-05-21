import { Injectable } from "@nestjs/common";
// import { OtherService } from "./other.service";
@Injectable()
export class CommonService {

    constructor() {
        console.log("CommonService constructor")
    }
    logger(message) {
        // this.otherService.logger(message)
        console.log("CommonService:" + message, "message")
    }
}