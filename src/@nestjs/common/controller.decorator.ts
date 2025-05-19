import "reflect-metadata"


// 其实可以给Controller传递路径前缀
/*
可以为空
可以是空串
可以是对象{prefix: "xxx"}
*/
interface ControllerOptions {
    prefix?: string
}

export function Controller(): ClassDecorator // 空的字符串
export function Controller(prefix: string): ClassDecorator // 字符串   
export function Controller(options: ControllerOptions): ClassDecorator // 对象
export function Controller(prefixOrOptions?: string | ControllerOptions): ClassDecorator {
    let options: ControllerOptions = {}
    if (typeof prefixOrOptions === "string") {
        options.prefix = prefixOrOptions
    } else if (typeof prefixOrOptions === "object") { 
        options = prefixOrOptions
    }
    // 给控制器类添加prefix路径前缀的元数据
    return function (target: Function) {
        Reflect.defineMetadata("prefix", options.prefix || '', target) 
    }
}


