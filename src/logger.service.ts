import { Injectable } from "@nestjs/common";

@Injectable()
export class LoggerService {
    logger() {
        console.log("LoggerService")
    }
}

@Injectable()
export class LoggerClassService {
    logger() {
        console.log("loggerClassService")
    }
}


@Injectable()
export class UseValueService {
    constructor(private  prefix: string) {

    }
    logger() {
        console.log("UseValueService")
    }
}


@Injectable()
export class UseFactoryService {
    constructor(private prefix1: string, private prefix2: string) {

    }

    logger() {
        console.log("UseFactoryService")
    }
}
