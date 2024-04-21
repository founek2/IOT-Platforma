// https://github.com/koa-modules/morgan/blob/master/index.js
import originalMorgan from 'morgan'
import Koa from "koa"


function morgan(format: any, options?: any): Koa.Middleware<Koa.DefaultState, Koa.DefaultContext, any> {
    const fn = originalMorgan(format, options)
    return (ctx, next) => {
        return new Promise((resolve, reject) => {
            fn(ctx.req, ctx.res, (err) => {
                err ? reject(err) : resolve(ctx)
            })
        }).then(next)
    }
}

morgan.compile = originalMorgan.compile
morgan.format = originalMorgan.format
morgan.token = originalMorgan.token

export default morgan