import express from 'express';
import multer from 'multer';
import { verifyToken } from '../middleware/authMiddleware';
import { uploadCSV, getInsights, getTransactions } from '../controllers/transactionController';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', verifyToken, getTransactions);
router.post('/upload', verifyToken, upload.single('file'), uploadCSV);
router.get('/analyze', verifyToken, getInsights);

export default router;



