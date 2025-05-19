import { CommonService } from "./common.service";
import { Module } from "@nestjs/common";


@Module({
    providers: [
        CommonService
    ],
    exports: [
        CommonService
    ]
})
export class CommonModule {
}