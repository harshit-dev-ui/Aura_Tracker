import Question from "../model/question.model.js";
import Answer from "../model/answer.model.js";
// Create a new question
export const createQuestion = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const { title, description } = req.body;
    const userId = req.user._id;

    const newQuestion = new Question({
      title,
      description,
      createdBy: userId,
    });

    await newQuestion.save();

    const questionWithUser = await Question.findById(newQuestion._id).populate(
      "createdBy",
      "username"
    );

    return res.status(201).json(questionWithUser);
  } catch (error) {
    console.error("Error creating question:", error);
    return res.status(500).json({ message: "Error creating question", error });
  }
};

export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate("createdBy", "username");

    return res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res.status(500).json({ message: "Error fetching questions", error });
  }
};

export const deleteQuestionAndAnswers = async (req, res) => {
  try {
    const { questionId } = req.params;

    await Answer.deleteMany({ question: questionId });

    await Question.findByIdAndDelete(questionId);
    return res
      .status(200)
      .json({ message: "Question and answers deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete question and answers", error });
  }
};
