class Service {}

let moduleA = {
    providers: [
        Service
    ],
    exports: [
        Service
    ]
}
let moduleB = {
    providers: [
        Service
    ],
    exports: [
        Service
    ]
}

let AppModule = {
    imports: [
        moduleA,
        moduleB
    ],
    controllers: [
        
    ]
}


let providerInstances = {
    Service: new Service()
}

let moduleProviders = {
    moduleA: new Set([Service]),
    moduleB: new Set([Service]),
}