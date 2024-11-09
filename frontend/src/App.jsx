import { Route, Routes, Navigate } from "react-router-dom";
import { Dashboard, Website, Login, Signup, Layout } from "./pages/index";
import CourseDetail from "./components/CourseDetail";
import Leaderboard from "./pages/Leaderboard";
import Room from "./pages/Room";
import StudyRoom from "./pages/StudyRoom";
import Courses from "./pages/Courses";
import LandingPage from "./pages/LandingPage"; // Import LandingPage component

function App() {
  return (
    <main>
      <Routes>
        <Route element={<Layout />}>
          <Route index path="/" element={<Navigate to="/landing" />} />
          {/* Default route for Layout */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/rooms" element={<Room />} />
          <Route path="/rooms/:roomId" element={<StudyRoom />} />
          <Route path="*" element={<Dashboard />} />
        </Route>
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/website" element={<Website />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/landing" element={<LandingPage />} /> 
      </Routes>
    </main>
  );
}

export default App;
