import { Injectable } from "@nestjs/common";
import { CommonService } from "./common.service";

@Injectable()
export class OtherService {

    constructor(
        private commonService: CommonService
    ) {

    }


    
    logger(message) {
        this.commonService.logger("message")
        // console.log("OtherService:" + message, "message")
    }
}
