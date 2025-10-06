// routes/branch.routes.js
import express from 'express';
import { getBranches } from '../controllers/branch.controller.js';

const router = express.Router();

router.get('/:hospitalId', getBranches); // /api/branches/:hospitalId

export default router;
