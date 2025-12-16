import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import InternDashboard from "./pages/InternDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import ManagerStipend from "./pages/ManagerStipend";

import UserProfile from "./components/UserProfile";
import AdminProfile from "./pages/AdminProfile";
import EditUserPage from "./pages/EditUserPage";
import AddUserPage from "./pages/AddUserPage";
import ManageUsers from "./pages/ManageUsers";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ✅ PROTECTED ROUTE */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const getRedirectPath = () => {
    if (!user) return "/";
    if (user.role === "admin") return "/admin";
    if (user.role === "manager") return "/manager";
    if (user.role === "employee") return "/employee";
    return "/intern";
  };

  return (
    <BrowserRouter>
      <ToastContainer position="top-center" />
      <Routes>
        {/* ✅ LOGIN */}
        <Route
          path="/"
          element={user ? <Navigate to={getRedirectPath()} replace /> : <Login />}
        />

        {/* ✅ ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-user"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddUserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-user/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EditUserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/user/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* ✅ MANAGER ROUTES */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/stipend"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerStipend />
            </ProtectedRoute>
          }
        />

        {/* ✅ EMPLOYEE */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ INTERN */}
        <Route
          path="/intern"
          element={
            <ProtectedRoute allowedRoles={["intern"]}>
              <InternDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
