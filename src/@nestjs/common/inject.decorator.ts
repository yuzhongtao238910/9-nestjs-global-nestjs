import "reflect-metadata"
import { INJECTED_TOKENS } from "./constant"
export function Inject(token: string): ParameterDecorator {
    /**
     * target: 类的圆形
     * propertyKey: 方法的名字
     * parameterIndex: 参数的索引
     */
    return function (target: Function, propertyKey: string, parameterIndex: number) {
        // 给类的定义添加一个元数据
        // 取出被注入到此类的构造函数之中的token数组
        const existingInjectedTokens = Reflect.getMetadata(INJECTED_TOKENS, target) ?? []
        existingInjectedTokens[parameterIndex] = token
        // 把数组保存在target的元数据上面了
        Reflect.defineMetadata(INJECTED_TOKENS, existingInjectedTokens, target)
    }
}