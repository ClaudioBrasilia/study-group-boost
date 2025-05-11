
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";
import Progress from "./pages/Progress";
import Timer from "./pages/Timer";
import Water from "./pages/Water";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Plans from "./pages/subscription/Plans";
import TestGenerator from "./pages/premium/TestGenerator";
import "./i18n";

const queryClient = new QueryClient();

const App = () => {
  // Force first render after i18n is initialized
  useEffect(() => {}, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/group/:groupId" element={<GroupDetail />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/timer" element={<Timer />} />
            <Route path="/water" element={<Water />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/generate-test" element={<TestGenerator />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
