import {Router} from 'express';
import {notifyLive} from '../controllers/webhookController.js';

const router = Router();

router.get('/notifyLive', notifyLive);

export default router;