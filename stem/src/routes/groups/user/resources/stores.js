import express from 'express';

import { getStores } from '../../../../controllers/user/stores.js';

const router = express.Router();

router.get('/', getStores);

export default router;