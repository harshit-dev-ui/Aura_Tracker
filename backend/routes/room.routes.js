import express from 'express';
import Room from '../model/room.model.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

// Create or Join a Room
router.post('/join',protectRoute, async (req, res) => {
  const { roomId, userId, timerDuration = 1500 } = req.body;

  try {
    let room = await Room.findOne({ roomId });

    if (!room) {
      room = await Room.create({
        roomId,
        participants: [userId],
        timer: timerDuration,
        isRunning: false,
        lastUpdated: new Date(),
      });
    } else {
      if (!room.participants.includes(userId)) {
        room.participants.push(userId);
        await room.save();
      }
    }

    res.status(200).json({ roomId: room.roomId, participants: room.participants });
  } catch (err) {
    res.status(500).json({ error: 'Failed to join or create room' });
  }
});

// Leave a Room
router.post('/leave', protectRoute,async (req, res) => {
  const { roomId, userId } = req.body;

  try {
    const room = await Room.findOne({ roomId });
    if (room) {
      room.participants = room.participants.filter((id) => id.toString() !== userId);
      await room.save();
    }

    res.status(200).json({ message: 'Left the room', participants: room ? room.participants : [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to leave room' });
  }
});

// Start the Timer
router.post('/:roomId/timer/start',protectRoute,async (req, res) => {
  const { roomId } = req.params;
  const { timerDuration } = req.body;

  try {
    const room = await Room.findOneAndUpdate(
      { roomId },
      { isRunning: true, timer: timerDuration, lastUpdated: new Date() },
      { new: true }
    );

    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ error: 'Failed to start timer' });
  }
});

// Stop the Timer
router.post('/:roomId/timer/stop', async (req, res) => {
  const { roomId } = req.params;

  try {
    const room = await Room.findOneAndUpdate(
      { roomId },
      { isRunning: false },
      { new: true }
    );

    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ error: 'Failed to stop timer' });
  }
});

export default router;
