// Endpoint to get users sorted by aura points
app.get('/api/leaderboard', async (req, res) => {
    try {
        const users = await User.find().sort({ auraPoints: -1 }).limit(50); // Limit can be adjusted
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leaderboard data' });
    }
});
