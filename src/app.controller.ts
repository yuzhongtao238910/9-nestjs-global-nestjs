import { Controller, Get, Req, Inject } from "@nestjs/common"
import { CoreService } from "./core.service"
import { CommonService } from "./common.service"
import { OtherService } from "./other.service"
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


        private readonly otherService: OtherService

    ) {

    }

    @Get("other")
    getOther() { 
        this.otherService.logger("otherService")
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
}