import { Route, Routes, Navigate } from "react-router-dom";
import { Dashboard, Website, Login, Signup, Layout } from "./pages/index";
import CourseDetail from "./components/CourseDetail";
import Leaderboard from "./pages/Leaderboard";
function App() {
  return (
    <main>
      <Routes>
        <Route element={<Layout />}>
          <Route index path="/" element={<Navigate to="/dashboard" />} />
          {/* Default route for Layout */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<Dashboard />} />
        </Route>
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/website" element={<Website />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </main>
  );
}

export default App;
