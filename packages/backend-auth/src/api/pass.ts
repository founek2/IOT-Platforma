import express from 'express';
import { getPass } from '../services/TemporaryPass';

const router = express.Router();

/**
 * URL prefix /actions
 */

router.get('/pass', async function (req, res) {
    (await getPass())
        .ifJust((pass) => {
            res.send({
                pass,
            });
        })
        .ifNothing(() => res.sendStatus(503));
});

export default router;
