import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
// import { LoggerService } from "./logger.service"
// import { LoggerModule } from "./logger.module"
// import { CoreModule } from "./core.module"
import { CommonModule } from "./common.module"
import { OtherModule } from "./other.module"
// import { Common2Module } from "./common2.module"

import { DynamicConfigModule } from "./dynamicConfig.module"
@Module({
    controllers: [AppController],
    providers:[
        AppService,
    ],
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
        // CommonModule,
        // OtherModule,
        // 动态模块需要调用forRoot方法
        // 需要让import来支持动态模块
        // 这块是可以传参数的
        DynamicConfigModule.forRoot("params")
    ],
    exports: [
        AppService
    ]
})
export class AppModule {}
