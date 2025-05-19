import { Module } from "@nestjs/common"
import { LoggerService, LoggerClassService, UseValueService, UseFactoryService } from "./logger.service";


@Module({
    providers: [
        {
            provide: "SUFFIX",
            useValue: "suffix"
        },
        LoggerClassService,
        {
            provide: LoggerService,
            useClass: LoggerService
        },
        {
            provide: "StringToken",
            useValue: new UseValueService("prefix")
        },
        {
            provide: "FactoryToken",
            inject: ["prefix1", "prefix2"],
            useFactory: (prefix1, prefix2) => {
                return new UseFactoryService(prefix1, prefix2)
            }
        }
    ],
    exports: [
        "SUFFIX",
        LoggerClassService,
        LoggerService,
        "StringToken",
        "FactoryToken"
    ],
    imports: [],
    controllers: [],
})
export class LoggerModule {

}