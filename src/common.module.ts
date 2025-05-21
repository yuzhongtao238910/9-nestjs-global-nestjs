import { CommonService } from "./common.service";
import { Module, Global } from "@nestjs/common";


// 但是实际上还是要注意顺利哈
// 此时里面的所有的模块都是全局的了
@Global()
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