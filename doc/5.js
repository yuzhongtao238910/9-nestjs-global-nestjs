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

