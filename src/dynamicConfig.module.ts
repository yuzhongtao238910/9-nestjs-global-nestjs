import { DynamicModule } from "@nestjs/common";
import { Module } from "@nestjs/common";
export interface Config {
    apiKey: string
}

@Module({
    // 老的providers
    providers: [
        {
            provide: "PREFIX",
            useValue: "prefix"
        }
    ],
    exports: [
        "PREFIX"
    ]
})
export class DynamicConfigModule {
    static forRoot(apiKey: string): DynamicModule | Promise<DynamicModule> {

        // 根据参数来动态的创建providers
        const providers = [
            {
                provide: 'CONFIG',
                useValue: {
                    apiKey: apiKey
                }
            }
        ]

        const controllers = []
        // return {
        //     module: DynamicConfigModule,
        //     // 新的provider数组
        //     providers: providers,
        //     exports: providers.map(item => {
        //         // 类：
        //         return item instanceof Function ? item : item.provide
        //     }),
        //     controllers: controllers
        // }

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    module: DynamicConfigModule,
                    // 新的provider数组
                    providers: providers,
                    exports: providers.map(item => {
                        // 类：
                        return item instanceof Function ? item : item.provide
                    }),
                    controllers: controllers
                })
            }, 3000)
        })
    }
}