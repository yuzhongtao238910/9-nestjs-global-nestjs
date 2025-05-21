import express, { Express, Request as ExpressRequest, Response as ExpressResponse, 
    NextFunction  } from "express"
import path from "path"
import { INJECTED_TOKENS, DESGIN_PARAMTYPES, defineModule } from "@nestjs/common"
import { AppModule } from "src/app.module"
import { CommonModule } from "src/common.module"

export class NestApplication {


    private readonly app: Express = express()

    // 在此处保存全部的providers
    // private readonly providers = new Map<any, any>()


    // 在此处保存所有得provider得实例，key就是token，值就是类得实例
    private readonly providerInstances = new Map<any, any>()

    // 此处存放着全局的provider
    // 保存全局得provider
    private readonly globalProviders = new Set<any>()


    // 需要实现模块之间得隔离
    // 记录每个模块之中有哪些provider得token
    private readonly modulesProviders = new Map<any, any>()

    constructor(private readonly module: any) {
        
    }


    async initProviders() {
        const imports = Reflect.getOwnMetadata("imports", this.module) ?? []


        const selfProviders = Reflect.getOwnMetadata("providers", this.module) ?? []


        for (const importModule of imports) { // LoggerModule
            // 获取导入模块之中的提供者的数据哈
            /**
                [
                    { provide: 'SUFFIX', useValue: 'suffix' },
                    [class AppleService],
                    { provide: [class LoggerService], useClass: [class LoggerService] },
                    { provide: 'StringToken', useValue: UseValueService {} },
                    { provide: 'FactoryToken', useFactory: [Function: useFactory] }
                ]
             */

            // 这样写就不对了，此处是拿到导入得模块得providers，进行得全量得注册
            // 这样是不对得
            // 1- 有可能导入得模块只导出了一部分并没有进行全量得导出， 需要使用exports进行了过滤
            // 2- 

            //  


            // for (const exportToken of exports) {
            //     // 遍历export导出对象哈

            //     if (this.isModule(exportToken)) {

            //     } else {
            //         const provider = importedProviders.find(provider => provider === exportToken || provider.provide === exportToken)
            //         // 解决第一个问题：需要使用exports进行过滤
            //         if (provider) {
            //             this.addprovider(provider)
            //         }
            //     }

                
            // }
            // 第2个问题：exports之中可能还有module， 需要进行递归处理


            // 再这块来区分是否是动态模块哈

            let importedModule = importModule
            if (importModule instanceof Promise) {
                // 如果导入的是一个promise，说明是一个异步的动态模块
                importedModule = await importModule
            }

            if ('module' in importedModule) {
                // 如果导入的模块有module属性，说明这个个是一个动态模块
                const { module, providers, exports, controllers } = importedModule

                const oldProviders = Reflect.getMetadata("providers", module) ?? []
                // console.log(oldProviders, "oldProviders")
                // 需要和之前的老的进行合并，就是和@Module里面的providers以及exports进行合并哈
                const newProviders = [
                    ...(oldProviders ?? []),
                    ...(providers ?? [])
                ]

                const oldExports = Reflect.getMetadata("exports", module) ?? []
                const newExports = [
                    ...(oldExports ?? []),
                    ...(exports ?? [])
                ]

                const oldControllers = Reflect.getMetadata("controllers", module) ?? []
                const newControllers = [
                    ...(oldControllers ?? []),
                    ...(controllers ?? [])
                ]

                // 需要把新的providers和exports进行合并
                Reflect.defineMetadata("providers", newProviders, module)
                Reflect.defineMetadata("exports", newExports, module)
                Reflect.defineMetadata("controllers", newControllers, module)

                defineModule(module, newProviders)
                defineModule(module, newControllers)
                
                this.registerProvidersFromModule(module, this.module)
                
            } else {
                // 普通模块哈
                this.registerProvidersFromModule(importedModule, this.module)
            }

            
        }

        // 遍历并且添加每一个提供者
        for (const provider of selfProviders) {
            this.addprovider(provider, this.module)
        }

        // console.log(this.modulesProviders, "this.modulesProviders")
        // console.log(this.providerInstances, "this.providerInstances")
        // console.log(this.globalProviders, "this.globalProviders")

        // setTimeout(() => {
        //     let app1 = this.modulesProviders.get(AppModule)
        //     let app2 = this.modulesProviders.get(CommonModule)
        //     console.log(app1, "this.modulesProviders.get(AppModule)")
        //     console.log(app2, "this.modulesProviders.get(CommonModule)")
        //     console.log(app1 === app2, "this.modulesProviders.get(AppModule) === this.modulesProviders.get(CommonModule)")
        // }, 1000)
    }

    private registerProvidersFromModule(module, ...parentModules) {

        // 获取导入的是不是全局模块，是否有这个元数据
        const global = Reflect.getOwnMetadata("global", module)


        const exports = Reflect.getOwnMetadata("exports", module) ?? []

        const importedProviders = Reflect.getMetadata("providers", module) ?? []


        for (const exportToken of exports) {
            // 遍历export导出对象哈

            if (this.isModule(exportToken)) {
                // 执行递归操作
                this.registerProvidersFromModule(exportToken, module, ...parentModules)
            } else {
                const provider = importedProviders.find(provider => provider === exportToken || provider.provide === exportToken)

                // 解决第一个问题：需要使用exports进行过滤
                if (provider) {
                    // 子模块 父模块
                    [module, ...parentModules].forEach(module => {
                        this.addprovider(provider, module, global)
                    })
                    // this.addprovider(provider, module)
                }
            }

            
        }
    


        // for (const provider of importedProviders) {
        //     this.addprovider(provider)
        // }
    }

    private isModule(exportToken) {
        // 咋判断是否是一个模块，
        return exportToken && exportToken instanceof Function && Reflect.getMetadata("isModule", exportToken)
    }


    /**
     * 原来得provider都混在了一起，现在需要分开，每个模块有自己得provider
     * 需要记录自己得provider
     * @param provider 
     * @returns 
     */
    private addprovider(provider, module, global = false) {


        
        /**
         * let modulesProviders = {
         *     appModule: new Set(),
         *     CommonModule: new Set(),
         *     OtherModule: new Set(),
         * }
         */
        // 获取当前模块的providers
        // 此providers代表module这个模块的providers得token
        const providers = global ? this.globalProviders : (this.modulesProviders.get(module) ?? new Set())

        if (!this.modulesProviders.has(module)) {
            this.modulesProviders.set(module, providers)
        }

        // 如果token对应的实例已经有了，就不再需要实例化了

        // 获取要注册的provider的token
        let injectToken = provider.provide ?? provider
        // 判断是否已经注册过了
        if (this.providerInstances.has(injectToken)) {
            // 实例池子里面已经有此token对应的实例了，就不再需要创建了
            providers.add(injectToken)
            return
        }





        // let providers = this.modulesProviders.get(module)
        // if (!providers) {

        // }

        // 为了避免循环依赖，每次添加前可以做判断，如果map里面已经存在，那么就直接返回了
        // const injectToken = provider.provide ?? provider
        // // 如果已经注册过了，就不要往下走了
        // if (this.providers.has(injectToken)) return;


        if (provider.provide && provider.useClass) {
            // 1- 获取类的定义 
            const Clazz = provider.useClass
            // 2- 获取此类的参数
            const dependencies = this.resolveDependencies(Clazz, module)
            // 创建提供者类的实例
            const value = new Clazz(...dependencies)
            // 最后注册provider
            // this.providers.set(provider.provide, value)
            this.providerInstances.set(provider.provide, value)
            providers.add(provider.provide)

        } else if (provider.provide && provider.useValue) {
            // 如果提供的是一个值，那么就直接放到map里面哈
            // this.providers.set(provider.provide, provider.useValue)
            this.providerInstances.set(provider.provide, provider.useValue)
            providers.add(provider.provide)
        } else if (provider.provide && provider.useFactory) {
            // 1- 获取要注入工厂函数的参数
            const inject = provider.inject ?? []
            // 2- 解析出来参数的值
            const injectedValues = inject.map((injectToken) => {
                return this.getProviderByToken(injectToken, module)
            })
            // 3- 执行工厂方法获取返回的值
            const value = provider.useFactory(...injectedValues)
            // 4- 注册
            // this.providers.set(provider.provide, value)
            this.providerInstances.set(provider.provide, value)
            providers.add(provider.provide)
        } else {
            const dependencies = this.resolveDependencies(provider, module) ?? []
            const value = new provider(...dependencies)
            // this.providers.set(provider, value)
            this.providerInstances.set(provider, value)
            providers.add(provider)
        }

        // console.log(this.providers, 146)
    }


    private resolveDependencies(Class, module1) {
        
        // 取得注入的token
        const injectedTokens = Reflect.getMetadata(INJECTED_TOKENS, Class) ?? []

        // 获取构造函数的参数的类型
        const constructorParams = Reflect.getMetadata(DESGIN_PARAMTYPES, Class)


        return constructorParams?.map((param, index) => {

            const module = Reflect.getMetadata("nestModule", Class)


            return this.getProviderByToken(injectedTokens[index] ?? param, module)

        }) || []

    }


    private getProviderByToken(injectedToken, module) {

        // 先判断是不是全局的




        // 如何通过token再特定的模块下找到对应的provider
        // 1- 先找到此模块对应的token set
        // 在判断此injectedToken在不在此set之中
        // return this.providers.get(injectedToken) ?? injectedToken
        if (this.modulesProviders.get(module)?.has(injectedToken)) {
            return this.providerInstances.get(injectedToken)
        } else if (this.globalProviders.has(injectedToken)) {
            return this.providerInstances.get(injectedToken)
        } else {
            return null
        }
    }
    async init() {
        const controllers = Reflect.getOwnMetadata("controllers", this.module) || []


        for (const Controller of controllers) {

            const dependencies = this.resolveDependencies(Controller, this.module)

            const controller = new Controller(...dependencies)
            // 获取控制器类的路径前缀
            const prefix = Reflect.getOwnMetadata("prefix", Controller) || ''


            const controllerPrototype = Reflect.getPrototypeOf(controller)


            for (const methodName of Object.getOwnPropertyNames(controllerPrototype)) {
                const method = controllerPrototype[methodName]
                // 获取此函数上绑定的方法名字的元数据
                const httpMethod = Reflect.getMetadata("method", method)
                // 获取此函数上绑定的路径的元数据
                const pathMetaData = Reflect.getMetadata("path", method)

                // 获取重定向的地址
                const redirectUrl = Reflect.getMetadata("redirectUrl", method)
                // 获取重定向的状态码
                const redirectStatusCode = Reflect.getMetadata("redirectStatusCode", method)

                // 获取状态码
                const statusCode = Reflect.getMetadata("statusCode", method)

                // 获取响应头
                const headers = Reflect.getMetadata("headers", method) ?? []

                // 如果方法名字不存在，那么就不处理了
                if (!httpMethod) {
                    continue
                }
                const routePath = path.posix.join("/", prefix, pathMetaData)
                this.app[httpMethod.toLowerCase()](routePath, (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
                    const args = this.resolveParams(controller, method, methodName, req, res, next)

                    const result = method.call(controller, ...args)


                    if (result?.url) {
                        return res.redirect(res?.statusCode || 302, result?.url)
                    }

                    // 判断如果需要重定向，就直接重定向到指定的redirectUrl里面去
                    if (redirectUrl) {
                        return res.redirect(redirectStatusCode || 302, redirectUrl)
                    }



                    // 状态码，在nestjs之中，响应的状态码默认是200，但是post请求的状态码是201，我们可以使用@HttpCode来修改状态码的
                    // 201的意思就是实体创建成功哈
                    if (statusCode) {
                        res.statusCode = statusCode
                    } else if (httpMethod === "POST") {
                        res.statusCode = 201
                    }

                    

                    // 判断controller的methodName方法里面是否有使用Response或者Res参数装饰器，如果用了任何一个，就不在这里发送响应
                    // 有方法自己处理

                    const responseMeta = this.getResponseMetadata(controller, methodName)
                    // 判读是否有注入res或者是response装饰器
                    // 或者是注入了，但是传递了passthrough参数，都会由nestjs来返回相应
                    if (!responseMeta || responseMeta?.data?.passthrough) {

                        // 设置响应头
                        headers?.forEach(header => {
                            res.setHeader(header.name, header.value)
                        })

                        // 把返回值序列化发回给客户端
                        res.send(result)
                    }
                })

            }

        }
    }


    getResponseMetadata(controller, methodName) {
        const metaData =Reflect.getMetadata("params", Reflect.getPrototypeOf(controller), methodName) || []
        return metaData.filter(Boolean).find(item => item.key === 'Res' || item.key === 'Response' || item.key === "Next")
    }

    resolveParams(target: any, method: any, methodName: any, req: ExpressRequest, res: ExpressResponse, next: NextFunction) {

        // const existingParameters = Reflect.getMetadata("params", Reflect.getPrototypeOf(target), methodName) || []


        const existingParameters = Reflect.getMetadata("params", Reflect.getPrototypeOf(target), methodName) ?? []

        let temp = existingParameters
        if (existingParameters && existingParameters.length) {
            // temp = existingParameters.sort((a, b) => a.parameterIndex - b.parameterIndex)
        }
        

        return temp.map((item, index) => {
            const {key, data, factory} = item
            const context = { // 因为nestjs不但支持http，还支持graphql，rpc等等其他的方式哈
                // 这块是为了兼容处理哈
                switchToHttp: () => {
                    return {
                        getRequest: ()=> req,
                        getReponse: ()=> res,
                        getNext: ()=> next
                    }
                }
            }
            switch (key) {
                case "Req":
                case "Request":
                    return req
                case "Res":
                case "Response":
                    return res
                case "Query":
                    return data ? req.query[data] : req.query
                case "Headers":
                    return data ? req.headers[data] : req.headers
                case "Session":
                    return data ? req.session[data] : req.session
                case "Ip":
                    return req.ip
                case "Param":
                    return data ? req.params[data] : req.params
                case "Body":
                    return data ? req.body[data] : req.body
                case "Next":
                    return next
                case "DecoratorFactory":
                    return factory(data, context)
                    // return req.user
                default:
                    return null
            }
        })
        // .filter(item => item)
    }


    async listen(port: number) {
        // 在这块支持异步
        await this.initProviders()
        await this.init()
        // 调用express实例的listen方法启动一个express的app服务器，监听port端口
        this.app.listen(port, () => {
            // 启动成功后，打印日志
            
        })
    }

}