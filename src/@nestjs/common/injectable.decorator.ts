import "reflect-metadata"

export function Injectable(): ClassDecorator {
    return function (target: Function) {
        // 给类的定义添加一个元数据
        Reflect.defineMetadata("injectable", true, target)
    }
}