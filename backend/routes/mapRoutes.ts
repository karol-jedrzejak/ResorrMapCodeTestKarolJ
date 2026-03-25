import { Router } from 'express';
import {getMap,bookCabana} from '../controllers/mapController.ts';

const router = Router();

router.get('/map', getMap);
router.post('/book', bookCabana);

export default router;
