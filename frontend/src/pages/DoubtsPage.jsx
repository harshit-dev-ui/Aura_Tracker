import { useEffect, useState } from "react";
import {
  fetchQuestions,
  submitQuestion,
  submitAnswer,
  upvoteAnswer,
  downvoteAnswer,
  fetchAnswersByIds,
  deleteQuestionAndAnswers,
} from "../utils/doubtService"; // Import the functions
import { getUserAuraPoints } from "../utils/getuserAuraPoints";
const DoubtsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAnswerDialogOpen, setIsAnswerDialogOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const loadQuestions = async () => {
    try {
      const fetchedQuestions = await fetchQuestions();
      const questionsWithAnswers = await Promise.all(
        fetchedQuestions.map(async (question) => {
          const answers = await fetchAnswersByIds(question._id);
          const answersArray = Array.isArray(answers)
            ? answers
            : Object.values(answers);

          return { ...question, answers: answersArray };
        })
      );
      console.log(questionsWithAnswers);

      setQuestions(questionsWithAnswers);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };
  async function fetchAuraPoints() {
    try {
      const points = await getUserAuraPoints();
      dispatch(updateAuraPoints(points));
    } catch (error) {
      console.error("Failed to fetch aura points:", error);
    }
  }
  useEffect(() => {
    loadQuestions();
  }, []);

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const toggleAnswerDialog = (question) => {
    setSelectedQuestion(question);
    setIsAnswerDialogOpen(!isAnswerDialogOpen);
  };

  const handleQuestionSubmit = async () => {
    try {
      const newQuestion = { title: questionText, description: questionText };
      const createdQuestion = await submitQuestion(newQuestion);
      setIsDialogOpen(false);
      setQuestionText("");
      loadQuestions();
    } catch (error) {
      console.error("Error submitting question:", error);
    }
  };

  const handleAnswerSubmit = async () => {
    try {
      const answer = { content: answerText, questionId: selectedQuestion._id };
      const createdAnswer = await submitAnswer(answer.questionId, answer);
      setIsAnswerDialogOpen(false);
      await fetchAuraPoints();
      setAnswerText("");
      loadQuestions();
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const handleUpvote = async (questionId, answerId) => {
    try {
      // Upvote the answer
      const updatedAnswer = await upvoteAnswer(answerId);

      // Update the questions state with the updated answer
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q._id === questionId
            ? {
                ...q,
                answers: q.answers.map((a) =>
                  a._id === answerId
                    ? {
                        ...a,
                        upvotes: updatedAnswer.upvotes, // Ensure the upvotes are updated
                      }
                    : a
                ),
              }
            : q
        )
      );
      await fetchAuraPoints();
    } catch (error) {
      console.error("Error upvoting answer:", error);
    }
  };

  const handleDownvote = async (questionId, answerId) => {
    try {
      // Downvote the answer
      const updatedAnswer = await downvoteAnswer(answerId);

      // Update the questions state with the updated answer
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q._id === questionId
            ? {
                ...q,
                answers: q.answers.map((a) =>
                  a._id === answerId
                    ? {
                        ...a,
                        downvotes: updatedAnswer.downvotes, // Ensure the downvotes are updated
                      }
                    : a
                ),
              }
            : q
        )
      );
    } catch (error) {
      console.error("Error downvoting answer:", error);
    }
  };
  const handleResolveQuestion = async (questionId) => {
    try {
      await deleteQuestionAndAnswers(questionId); // Delete the question and answers in the backend
      setQuestions((prevQuestions) =>
        prevQuestions.filter((q) => q._id !== questionId)
      ); // Remove the deleted question from state
    } catch (error) {
      console.error("Error resolving question:", error);
    }
  };
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold mb-6">All Doubts</h2>

      {/* Set a max height and enable scrolling if content exceeds the height */}
      <div
        className="space-y-4 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
        {questions.map((question) => (
          <div key={question._id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xl font-semibold">{question.title}</h4>
              <p className="text-sm text-gray-500">
                Asked by: {question.createdBy?.username}
              </p>
            </div>
            <p className="mb-2">{question.description}</p>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              onClick={() => toggleAnswerDialog(question)}
            >
              Answer
            </button>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ml-2"
              onClick={() =>
                setQuestions((prevQuestions) =>
                  prevQuestions.map((q) =>
                    q._id === question._id
                      ? { ...q, showAllAnswers: !q.showAllAnswers }
                      : q
                  )
                )
              }
            >
              {question.showAllAnswers
                ? "Hide All Answers"
                : "Show All Answers"}
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 ml-2"
              onClick={() => handleResolveQuestion(question._id)}
            >
              Resolve
            </button>
            {question.showAllAnswers && (
              <div className="mt-4 space-y-2">
                {question.answers?.map((answer) => (
                  <div
                    key={answer._id}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm"
                  >
                    <p>{answer.content || "Answer content not available"}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-gray-500 italic">
                        Answered by: {answer.createdBy?.username || "Unknown"}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          className="bg-green-500 text-white py-1 px-2 rounded-lg hover:bg-green-600"
                          onClick={() => handleUpvote(question._id, answer._id)}
                        >
                          Upvote ({answer.upvotes || 0})
                        </button>
                        <button
                          className="bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-600"
                          onClick={() =>
                            handleDownvote(question._id, answer._id)
                          }
                        >
                          Downvote ({answer.downvotes || 0})
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        className="fixed bottom-4 right-4 p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 focus:outline-none"
        onClick={toggleDialog}
      >
        Ask a Doubt
      </button>

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-xl font-semibold mb-4">Ask a Doubt</h3>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full p-2 mb-4 border rounded-md"
              rows="4"
              placeholder="Type your question here"
            />
            <button
              onClick={handleQuestionSubmit}
              className="w-full bg-green-500 text-white py-2 rounded-md"
            >
              Submit Question
            </button>
            <button
              onClick={toggleDialog}
              className="w-full bg-gray-500 text-white py-2 rounded-md mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isAnswerDialogOpen && selectedQuestion && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-xl font-semibold mb-4">Answer Question</h3>
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              className="w-full p-2 mb-4 border rounded-md"
              rows="4"
              placeholder="Type your answer here"
            />
            <button
              onClick={handleAnswerSubmit}
              className="w-full bg-green-500 text-white py-2 rounded-md"
            >
              Submit Answer
            </button>
            <button
              onClick={() => setIsAnswerDialogOpen(false)}
              className="w-full bg-gray-500 text-white py-2 rounded-md mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoubtsPage;
