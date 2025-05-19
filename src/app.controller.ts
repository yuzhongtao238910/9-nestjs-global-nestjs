import { Controller, Get, Req, Inject } from "@nestjs/common"
import { CoreService } from "./core.service"
import { CommonService } from "./common.service"
@Controller()
export class AppController {

    constructor(
        // private readonly logger: LoggerService,
        // @Inject("StringToken") private readonly stringToken: UseValueService,
        // @Inject("FactoryToken") private readonly factoryToken: UseFactoryService,
        // private loggerClassService: LoggerClassService,
        // @Inject("SUFFIX") private readonly suffix: string


        private readonly coreService: CoreService,
        private readonly commonService: CommonService

    ) {

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


        console.log(this.coreService, "coreService")

        this.coreService.loggger("coreService")
        this.commonService.logger("commonService")

        return "module"
    }
}