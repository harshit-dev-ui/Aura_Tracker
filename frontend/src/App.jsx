import { Route, Routes, Navigate } from "react-router-dom";
import { Dashboard, Website, Login, Signup, Layout } from "./pages/index";
function App() {
  return (
    <main>
      <Routes>
        <Route element={<Layout />}>
          <Route index path="/" element={<Navigate to="/dashboard" />} />
          {/* Default route for Layout */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Dashboard />} />
        </Route>
        <Route path="/website" element={<Website />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </main>
  );
}

export default App;
