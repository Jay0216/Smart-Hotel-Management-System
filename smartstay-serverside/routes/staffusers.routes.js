import express from 'express';
import { getAllUsers } from "../controllers/staffusers.controller.js";

const router = express.Router();

router.get('/staffusers', getAllUsers);


export default router;