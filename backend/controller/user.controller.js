import User from "../model/user.model.js";

export const getUsers = async(req,res) => {
    try{
        const loggedInUserId = req.user._id;
    
		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error) {
        
		console.error("Error in getUsers: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
}

export const getAuraPoints = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const user = await User.findById(loggedInUserId).select("auraPoints");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ auraPoints: user.auraPoints });
    } catch (error) {
        console.error("Error in getAuraPoints:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
