import express from 'express';
import { events } from '../data/store.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Middleware to protect all routes
router.use(authMiddleware);

// FIX 1: Only return events the user created or was invited to
router.get('/', (req, res) => {
    const filteredEvents = events.filter(e => 
        e.creatorId === req.user.id || 
        e.invitedEmails.includes(req.user.email)
    );
    res.json(filteredEvents);
});

router.post('/', (req, res) => {
    const { title, description, date, invitedEmails } = req.body;
    const newEvent = {
        id: Date.now().toString(),
        title,
        description,
        date,
        creatorId: req.user.id,
        invitedEmails: invitedEmails || [],
        rsvps: []
    };
    events.push(newEvent);
    res.status(201).json(newEvent);
});

// FIX 2: Prevent unauthorized event data leak via ID
router.get('/:id', (req, res) => {
    const event = events.find(e => e.id === req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    const isCreator = event.creatorId === req.user.id;
    const isInvited = event.invitedEmails.includes(req.user.email);

    if (!isCreator && !isInvited) {
        return res.status(403).json({ message: 'Forbidden: You do not have access to this event' });
    }

    res.json({
        ...event,
        isCreator,
        isInvited,
        hasRSVPed: event.rsvps.includes(req.user.id)
    });
});

// FIX 3: Secure RSVP with invitation check and duplicate prevention
router.post('/:id/rsvp', (req, res) => {
    const event = events.find(e => e.id === req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const isInvited = event.invitedEmails.includes(req.user.email);
    if (!isInvited) {
        return res.status(403).json({ message: 'Forbidden: You must be invited to RSVP' });
    }

    const alreadyRSVPed = event.rsvps.includes(req.user.id);
    if (alreadyRSVPed) {
        return res.status(400).json({ message: 'Bad Request: You have already RSVPed' });
    }

    event.rsvps.push(req.user.id);
    res.json({ message: 'RSVP successful', event });
});

// FIX 4: Only allow creators to delete events
router.delete('/:id', (req, res) => {
    const index = events.findIndex(e => e.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Event not found' });

    const event = events[index];
    if (event.creatorId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: Only the creator can delete this event' });
    }

    events.splice(index, 1);
    res.json({ message: 'Event deleted successfully' });
});

export default router;
