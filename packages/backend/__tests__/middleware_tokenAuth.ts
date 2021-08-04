import express from 'express';
import tokenAuth from '../src/middlewares/tokenAuth';

describe('Middleware token Auth', function () {
    it('should not enter', async function () {
        let val = 0;

        const counter = ({ error }: { error: string }) => {
            if (error === 'invalidToken') ++val;
        };
        const res = { status: () => ({ send: counter }) } as unknown as express.Response;
        const next: express.NextFunction = () => {};

        await tokenAuth()({ get: () => 'invalidToken' } as unknown as express.Request, res, next);
        await tokenAuth({ methods: ['POST'] })(
            { get: () => 'jlskjdasd', method: 'POST' } as unknown as express.Request,
            res,
            next
        );
        val.should.equal(2);
    });

    it('should allow', async function () {
        let val = 0;
        const counter = () => {
            ++val;
        };
        // @ts-ignore
        await tokenAuth({ restricted: false })({ get: () => undefined }, null, counter);
        val.should.equal(1);
    });
});
