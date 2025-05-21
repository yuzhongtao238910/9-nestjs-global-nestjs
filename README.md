- exports 导出得可以是模块也可以是提供者
- imports 导入得只能模块哈
- 要想使用提供者，必须导入，不导入是不能使用的
- 当希望提供一组在所有的地方都可以开箱即用的提供者的时候，可以使用@Global装饰器来将模块设置为全局模块
- @Global() 装饰器使得模块具有全局范围，全局模块只会注册一次，通常由根模块或者是核心模块注册
- 全局模块不在需要其导入数组之中导入（不过所有模块都全局化不是一个好的设计决策）


- 模块的隔离原则
    - 每一个模块只能够访问自己的providers以及导入的providers，别的模块的providers是不能访问的
    - 否则就会报错



- parentModules

- 全局模块

- 动态模块
    - 轻松创建可以注册和配置提供者的自定义模块，提供者可以自定义的
    - 动态模块是扩展了，而不是覆盖了之前的元数据
```typescript

@Module({
    providers: [Connection],
    exports: [Connection]
})
export class DatabaseModule {
    static forRoot(entities = [], options?): DynamicModule {
        const providers = createDatabaseProviders(options, entities)

        return {
            module: DatabaseModule,
            providers: providers,
            exports: providers
        }
    }
}


import { DynamicConfigModule } from "./dynamicConfig.module"
DynamicConfigModule.forRoot()
```

- 动态模块的意义：
    - 1- 传参数
    - 2- 异步