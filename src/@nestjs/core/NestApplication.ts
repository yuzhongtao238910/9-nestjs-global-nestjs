import express, { Express, Request as ExpressRequest, Response as ExpressResponse, 
    NextFunction  } from "express"
import path from "path"
import { INJECTED_TOKENS, DESGIN_PARAMTYPES } from "@nestjs/common"
export class NestApplication {


    private readonly app: Express = express()

    // 在此处保存全部的providers
    private readonly providers = new Map<any, any>()
    constructor(private readonly module: any) {
        this.initProviders()
    }


    private initProviders() {
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


            this.registerProvidersFromModule(importModule)
        }

        // 遍历并且添加每一个提供者
        for (const provider of selfProviders) {
            this.addprovider(provider)
        }
    }

    private registerProvidersFromModule(module) {
        const exports = Reflect.getOwnMetadata("exports", module) ?? []

        const importedProviders = Reflect.getMetadata("providers", module) ?? []


        for (const exportToken of exports) {
            // 遍历export导出对象哈

            if (this.isModule(exportToken)) {
                // 执行递归操作
                this.registerProvidersFromModule(exportToken)
            } else {
                const provider = importedProviders.find(provider => provider === exportToken || provider.provide === exportToken)

                // 解决第一个问题：需要使用exports进行过滤
                if (provider) {
                    this.addprovider(provider)
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


    private addprovider(provider) {

        // 为了避免循环依赖，每次添加前可以做判断，如果map里面已经存在，那么就直接返回了
        const injectToken = provider.provide ?? provider
        // 如果已经注册过了，就不要往下走了
        if (this.providers.has(injectToken)) return;


        if (provider.provide && provider.useClass) {
            // 1- 获取类的定义 
            const Clazz = provider.useClass
            // 2- 获取此类的参数
            const dependencies = this.resolveDependencies(Clazz)
            // 创建提供者类的实例
            const value = new Clazz(...dependencies)
            // 最后注册provider
            this.providers.set(provider.provide, value)

        } else if (provider.provide && provider.useValue) {
            // 如果提供的是一个值，那么就直接放到map里面哈
            this.providers.set(provider.provide, provider.useValue)
        } else if (provider.provide && provider.useFactory) {
            // 1- 获取要注入工厂函数的参数
            const inject = provider.inject ?? []
            // 2- 解析出来参数的值
            const injectedValues = inject.map((injectToken) => {
                return this.getProviderByToken(injectToken)
            })
            // 3- 执行工厂方法获取返回的值
            const value = provider.useFactory(...injectedValues)
            // 4- 注册
            this.providers.set(provider.provide, value)
        } else {
            const dependencies = this.resolveDependencies(provider) ?? []
            const value = new provider(...dependencies)
            this.providers.set(provider, value)
        }

        console.log(this.providers, 146)
    }


    private resolveDependencies(Class) {
        
        // 取得注入的token
        const injectedTokens = Reflect.getMetadata(INJECTED_TOKENS, Class) ?? []

        // 获取构造函数的参数的类型
        const constructorParams = Reflect.getMetadata(DESGIN_PARAMTYPES, Class)


        return constructorParams?.map((param, index) => {
            return this.getProviderByToken(injectedTokens[index] ?? param)

        }) || []

    }


    private getProviderByToken(injectedToken) {
        return this.providers.get(injectedToken) ?? injectedToken
    }
    async init() {
        const controllers = Reflect.getOwnMetadata("controllers", this.module) || []


        for (const Controller of controllers) {

            const dependencies = this.resolveDependencies(Controller)

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
        await this.init()
        // 调用express实例的listen方法启动一个express的app服务器，监听port端口
        this.app.listen(port, () => {
            // 启动成功后，打印日志
            
        })
    }

}