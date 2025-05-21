import { DynamicModule } from "@nestjs/common";
import { Module } from "@nestjs/common";

@Module({
    providers: [],
    exports: []
})
export class DynamicConfigModule {
    static forRoot(entities = [], options?): DynamicModule {

        const providers = [
            {
                provide: 'CONFIG',
                useValue: {
                    apiKey: '123'
                }
            }
        ]

        return {
            module: DynamicConfigModule,
            providers: providers,
            exports: providers.map(item => {
                // 类：
                return item instanceof Function ? item : item.provide
            })
        }
    }
}