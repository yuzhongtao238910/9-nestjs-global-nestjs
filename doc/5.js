let CommonModule = {
    providers: [
        CommonService
    ],
    exports: [
        CommonService
    ]
}

class OtherService {
    CommonService
}


let OtherModule = {
    providers: [
        OtherService
    ],
    exports: [
        OtherService
    ]
}


class AppController {
    OtherService
}

let appModule = {
    imports: [
        CommonModule,
        OtherModule
    ],
    controllers: [
        AppController
    ]
}


let providerInstances = {
    
}

let moduleProviders = {

}

// A引用B，B导入导出C，C导入导出D
// 那么D模块之中有exports是【DService】
// 那么ABCD 模块都是可以使用DService的
