import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./App.css";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load all page components with named chunks for better debugging
const Login = lazy(() =>
  import(/* webpackChunkName: "login" */ "./pages/Login")
);
const Signup = lazy(() =>
  import(/* webpackChunkName: "signup" */ "./pages/Signup")
);
const Home = lazy(() => import(/* webpackChunkName: "home" */ "./pages/Home"));
const Services = lazy(() =>
  import(/* webpackChunkName: "services" */ "./pages/Services")
);
const About = lazy(() =>
  import(/* webpackChunkName: "about" */ "./pages/About")
);
const Contact = lazy(() =>
  import(/* webpackChunkName: "contact" */ "./pages/Contact")
);
const Blog = lazy(() => import(/* webpackChunkName: "blog" */ "./pages/Blog"));
const BlogDetail = lazy(() =>
  import(/* webpackChunkName: "blog-detail" */ "./pages/BlogDetail")
);
const STITesting = lazy(() =>
  import(/* webpackChunkName: "sti-testing" */ "./pages/STITesting")
);
const Tracking = lazy(() =>
  import(/* webpackChunkName: "tracking" */ "./pages/Tracking")
);

function App() {
  // Using AuthContext to get authentication state - now handled directly in ProtectedRoute
  // const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />{" "}
        {/* Tất cả các trang với Layout chung */}
        <Route path="/" element={<Layout />}>
          {/* Các trang công khai */}
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:id" element={<BlogDetail />} />

          {/* Các trang STI Testing và Tracking */}
          <Route
            path="services/sti-testing"
            element={
              <ProtectedRoute>
                <STITesting />
              </ProtectedRoute>
            }
          />
          <Route
            path="services/tracking"
            element={
              <ProtectedRoute>
                <Tracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <div>Profile Page</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="appointments"
            element={
              <ProtectedRoute>
                <div>Appointments Page</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="medical-records"
            element={
              <ProtectedRoute>
                <div>Medical Records</div>
              </ProtectedRoute>
            }
          />
        </Route>
        {/* Redirect không hợp lệ URLs về trang chính */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
