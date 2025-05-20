import { Module } from "@nestjs/common";
// import { CommonModule } from "./common.module";
import { CoreService } from "./core.service";

// 
@Module({
    imports: [
        // CommonModule
    ],
    providers: [
        CoreService
    ],
    // 把导入得重新向外进行了导出
    exports: [
        // CommonModule,
        CoreService
    ]
})
export class CoreModule {

}
