


let CommonModule = {
    providers: [
        CommonService
    ],
    exports: [
        CommonService
    ]
}


let OtherModule = {
    providers: [
        OtherService
    ],
    exports: [
        OtherService
    ]
}

let appModule = {
    imports: [
        CommonModule,
        OtherModule
    ]
}