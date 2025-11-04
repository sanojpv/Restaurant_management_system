import express from 'express';
import { cancelReservation, createReservation, getAllReservations, getUserReservation, updateReservation } from '../controllers/reservationController.js';

const router = express.Router();

router.post('/create',createReservation)
router.get('/:id',getUserReservation)
router.get('/',getAllReservations);
router.put('/:id',updateReservation);
router.delete('/:id',cancelReservation);
export default router;