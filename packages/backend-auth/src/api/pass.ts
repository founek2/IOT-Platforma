import express from 'express';
import { getPass, Pass } from '../services/TemporaryPass.js';

const router = express.Router();

/**
 * URL prefix /actions
 */

router.get('/', async function (req, res) {
    (await getPass())
        .ifJust((pass: Pass) => {
            res.send({
                pass,
            });
        })
        .ifNothing(() => res.sendStatus(503));
});

export default router;
