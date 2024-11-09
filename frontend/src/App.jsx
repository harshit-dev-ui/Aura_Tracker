import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Dashboard, Login, Signup, Layout } from "./pages/index";
import CourseDetail from "./components/CourseDetail";
import Leaderboard from "./pages/Leaderboard";
import Room from "./pages/Room";
import StudyRoom from "./pages/StudyRoom";
import Courses from "./pages/Courses";
import LandingPage from "./pages/LandingPage";
import DoubtsPage from "./pages/DoubtsPage";

function App() {
  const isLoggedIn = useSelector((state) => state.user.isAuthenticated);

  return (
    <main>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/landing" />} />

        {/* Layout-based routes */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/rooms" element={<Room />} />
          <Route path="/rooms/:roomId" element={<StudyRoom />} />
          <Route path="/doubts" element={<DoubtsPage />} />
          <Route path="*" element={<Dashboard />} />
        </Route>

        {/* Other standalone routes */}
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/landing" element={<LandingPage />} />
      </Routes>
    </main>
  );
}

export default App;
