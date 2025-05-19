let moduleA = {
    // 模块a可以使用1 2 3
    provides: [1, 2, 3],
    exports: [1, 2]
}

let moduleB = {
    // 模块b可以使用1 2 4 5
    imports: [moduleA],
    providers: [4, 5],
    exports: [
        moduleA
    ]
}

let moduleC = {
    // c可以使用 1 2
    imports: [moduleB],
}

export {}