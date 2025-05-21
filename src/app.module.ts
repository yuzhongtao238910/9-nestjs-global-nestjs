import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
// import { AppService } from "./app.service"
// import { LoggerService } from "./logger.service"
// import { LoggerModule } from "./logger.module"
// import { CoreModule } from "./core.module"
import { CommonModule } from "./common.module"
import { OtherModule } from "./other.module"
// import { Common2Module } from "./common2.module"
@Module({
    controllers: [AppController],
    // providers: [
    //     AppService,
    //     {
    //         provide: "logger",
    //         useValue: new LoggerService()
    //     }
    // ],
    imports: [
        // LoggerModule
        // CoreModule,
        // CoreModule,
       
        // Common2Module,
        CommonModule,
        OtherModule,
    ]
})
export class AppModule {}
