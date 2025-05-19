let CommonModule = {
    providers: [
        "CommonService"
    ],
    exports: [
        "CommonService"
    ]
}

let CoreModule = {
    imports: [
        'CommonModule'
    ],
    exports: [
        "CommonModule"
    ]
}

let AppModule = {
    imports: [
        "CoreModule"
    ],
    providers: [
        
    ]
}

export {}