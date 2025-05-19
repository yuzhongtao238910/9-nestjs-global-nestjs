import { Injectable } from "@nestjs/common";


export class CommonService {
    logger(message) {
        console.log("CommonService:" + message, "message")
    }
}