import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchLeaderboard } from '../utils/leaderboardService';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const loggedInUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const getLeaderboardData = async () => {
      try {
        const data = await fetchLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
      }
    };

    getLeaderboardData();
  }, []);

  if (!leaderboard.length) {
    return <div className="flex justify-center items-center h-screen">Loading leaderboard...</div>;
  }

  const topThree = leaderboard.slice(0, 3);
  const restOfUsers = leaderboard.slice(3);

  const loggedInUserRank = leaderboard.findIndex((user) => user._id === loggedInUser._id) + 1;

  return (
    <div className="w-screen h-screen flex flex-col gap-5 my-20 p-6 bg-white rounded-lg shadow-md">
      {/* Top 3 Users Display */}
      <div className="flex justify-center items-center mb-6 relative">
        {topThree.map((user, index) => (
          <div
            key={user._id}
            className={`flex flex-col items-center absolute ${index === 0 ? '-translate-y-4' : 'translate-y-4'} 
            ${index === 1 ? 'right-16' : index === 2 ? 'left-16' : 'translate-x-0'}`}
          >
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-blue-500 text-white text-xl font-bold">
              {index + 1}
            </div>
            <p className="mt-2 text-center text-sm font-semibold">{user.username}</p>
            <p className="text-center text-xs text-gray-500">{user.auraPoints} pts</p>
          </div>
        ))}
      </div>

      {/* Custom message for logged-in user */}
      {loggedInUserRank <= 3 ? (
        <div className="text-center text-lg font-semibold mt-8">
          Congratulations! You are in the top 3!
        </div>
      ) : (
        <div className="text-center text-lg font-semibold mt-8">
          Keep going! You're doing great. Your current rank: {loggedInUserRank}
        </div>
      )}

      {/* Remaining Users Table with scrollable content */}
      <div className="overflow-x-auto mt-8">
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-left table-auto">
            <thead>
              <tr>
                <th className="p-3 text-sm font-semibold text-gray-600">Rank</th>
                <th className="p-3 text-sm font-semibold text-gray-600">User</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Aura Points</th>
              </tr>
            </thead>
            <tbody>
              {restOfUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className={`${
                    user._id === loggedInUser._id ? 'bg-yellow-100' : 'bg-white'
                  } hover:bg-gray-100 transition-colors`}
                >
                  <td className="p-3 text-sm font-semibold text-gray-700">{index + 4}</td>
                  <td className="p-3 text-sm text-gray-700">{user.username}</td>
                  <td className="p-3 text-sm text-gray-700">{user.auraPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
