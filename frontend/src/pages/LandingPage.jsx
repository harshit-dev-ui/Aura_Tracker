import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center bg-gradient-to-r from-indigo-700 to-purple-900 text-white py-24 px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 leading-tight">
          Unlock Your Full Potential with Aura Tracker
        </h1>
        <p className="text-lg text-center mb-8 max-w-3xl">
          Track your study progress, earn aura points, ask and answer questions, and study together in virtual rooms. Join a community of dedicated learners today!
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white px-8 py-3 rounded-full font-semibold transition duration-300 shadow-lg"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-transparent border-2 border-teal-500 hover:bg-teal-500 text-teal-500 hover:text-white px-8 py-3 rounded-full font-semibold transition duration-300"
          >
            Login
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-gray-800">
        <h2 className="text-4xl font-bold text-center text-gray-200 mb-12">
          Why Aura Tracker?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Track Progress Feature */}
          <div className="bg-gray-700 p-8 rounded-lg shadow-xl text-center transform hover:scale-105 transition duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-gray-200">Track Your Progress</h3>
            <p className="text-gray-400">
              Monitor your study sessions, goals, and achievements, all in one place.
            </p>
          </div>
          {/* Aura Points Feature */}
          <div className="bg-gray-700 p-8 rounded-lg shadow-xl text-center transform hover:scale-105 transition duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-gray-200">Earn Aura Points</h3>
            <p className="text-gray-400">
              Earn points by completing tasks and goals. Redeem them for exciting rewards and challenges.
            </p>
          </div>
          {/* Virtual Study Rooms */}
          <div className="bg-gray-700 p-8 rounded-lg shadow-xl text-center transform hover:scale-105 transition duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-gray-200">Join Virtual Study Rooms</h3>
            <p className="text-gray-400">
              Study with others in synchronized virtual rooms, complete Pomodoro sessions together, and stay motivated.
            </p>
          </div>
          {/* Q&A Feature */}
          <div className="bg-gray-700 p-8 rounded-lg shadow-xl text-center transform hover:scale-105 transition duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-gray-200">Ask and Answer Questions</h3>
            <p className="text-gray-400">
              Post doubts, answer questions, and upvote helpful solutions from the community.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 py-24 px-6 text-white text-center">
        <h2 className="text-3xl font-bold mb-6">Start Your Journey Today!</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Sign up now and begin your path to success with Aura Tracker. Join a community of focused learners today!
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white px-8 py-3 rounded-full font-semibold transition duration-300 shadow-lg"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-transparent border-2 border-teal-500 hover:bg-teal-500 text-teal-500 hover:text-white px-8 py-3 rounded-full font-semibold transition duration-300"
          >
            Login
          </button>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="text-center">
          <p>&copy; 2024 Aura Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
