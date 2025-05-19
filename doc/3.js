let innerModule = {
    providers: [
        InnerService, AddService
    ],
    exports: [InnerService]
}

let commonModule = {
    imports: [innerModule],
    providers: [
        CommonService, AddService
    ],
    exports: [CommonService, innerModule]
}

let coreModule = {
    imports: [commonModule],
    providers: [],
    exports: [commonModule]
} 

let appModule = {
    // CommonService InnerService
    imports: [coreModule],
}
