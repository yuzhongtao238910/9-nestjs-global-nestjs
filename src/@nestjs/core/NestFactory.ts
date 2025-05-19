import { NestApplication } from "./NestApplication"

export class NestFactory {
    static create(module: any) {
        const app = new NestApplication(module)
        return app
    }
}