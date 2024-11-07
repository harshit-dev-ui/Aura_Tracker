import Goal from "../model/goals.model.js";
import User from "../model/user.model.js";
export const createGoal = async (req, res) => {
  try {
    const { title, deadline, priority, isCompleted, type } = req.body;
    const userId = req.user._id;

    const newGoal = new Goal({
      title,
      deadline,
      priority,
      isCompleted,
      type,
      createdBy: userId,
    });
    await newGoal.save();

    await User.findByIdAndUpdate(userId, {
      $push: { allGoals: newGoal._id },
    });

    res.status(201).json(newGoal);
  } catch (error) {
    console.error("Error saving goal:", error);
    res.status(500).json({ message: "Error creating goal", error });
  }
};

export const getGoals = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("allGoals");
    const goals = user.allGoals;
    res.status(200).json(goals);
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(500).json({ message: "Error fetching goals", error });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { isCompleted } = req.body;

    const goal = await Goal.findOne({ _id: id, createdBy: userId });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    let pointsToAdjust = 0;
    if (goal.type === "Personal Task") {
      pointsToAdjust = 10;
    } else if (goal.type === "Course Assignment") {
      pointsToAdjust = 20;
    }

    if (goal.isCompleted !== isCompleted) {
      if (isCompleted) {
        await User.findByIdAndUpdate(userId, {
          $inc: { auraPoints: pointsToAdjust },
        });
      } else {
        await User.findByIdAndUpdate(userId, {
          $inc: { auraPoints: -pointsToAdjust },
        });
      }
    }
    const updatedGoal = await Goal.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json(updatedGoal);
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({ message: "Error updating goal", error });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const goal = await Goal.findOneAndDelete({ _id: id, createdBy: userId });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { allGoals: id },
    });

    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).json({ message: "Error deleting goal", error });
  }
};
