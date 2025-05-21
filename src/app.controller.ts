import { Controller, Get, Req, Inject } from "@nestjs/common"
import { CoreService } from "./core.service"
import { CommonService } from "./common.service"
import { OtherService } from "./other.service"
import { AppService } from "./app.service"
@Controller()
export class AppController {

    constructor(
        // private readonly logger: LoggerService,
        // @Inject("StringToken") private readonly stringToken: UseValueService,
        // @Inject("FactoryToken") private readonly factoryToken: UseFactoryService,
        // private loggerClassService: LoggerClassService,
        // @Inject("SUFFIX") private readonly suffix: string


        // private readonly coreService: CoreService,
        // private readonly commonService: CommonService


        // private readonly otherService: OtherService,
        private readonly appService: AppService
        // private readonly commonService: CommonService

    ) {

    }

    @Get("other")
    getOther() { 
        
        // this.otherService.logger("otherService")
        // this.commonService.logger("commonService")
        return "other"
    }


    @Get("apple")
    getHello(@Req() req): string {

       
            // this.logger.logger()
            // this.stringToken.logger()
            // this.factoryToken.logger()
            // this.loggerClassService.logger()
            // console.log(this.suffix, "suffix")
        return "Hello World"
    }


    @Get("module")
    getModule() {


        // console.log(this.coreService)
        // console.log(this.commonService)
        // console.log(this.coreService, "coreService")

        // this.coreService.demo1()
        // this.commonService.logger("commonService")

        return "module"
    }


    @Get("config")
    getConfig() {
        return this.appService.getConfig()
    }
}