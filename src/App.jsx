import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
const Booking = lazy(() =>
  import(/* webpackChunkName: "Booking" */ "./pages/services/Booking")
);
const CustomerProfile = lazy(() =>
  import(/* webpackChunkName: "customer-profile" */ "./pages/CustomerProfile")
);
const ConsultantDetail = lazy(() =>
  import(/* webpackChunkName: "consultant-detail" */ "./pages/ConsultantDetail")
);
const Dashboard = lazy(() =>
  import(/* webpackChunkName: "dashboard" */ "./pages/Dashboard")
);
const Unauthorized = lazy(() =>
  import(/* webpackChunkName: "unauthorized" */ "./pages/Unauthorized")
);
const ForgotPasswordPage = lazy(() =>
  import(/* webpackChunkName: "forgot-password" */ "./pages/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(() =>
  import(/* webpackChunkName: "reset-password" */ "./pages/ResetPasswordPage")
);
const Payment = lazy(() =>
  import(/* webpackChunkName: "payment" */ "./pages/Payment")
);
const PaymentSuccess = lazy(() =>
  import(/* webpackChunkName: "payment-success" */ "./pages/PaymentSuccess")
);
const PaymentFailed = lazy(() =>
  import(/* webpackChunkName: "payment-failed" */ "./pages/PaymentFailed")
);
const VnpayCallback = lazy(() =>
  import(/* webpackChunkName: "vnpay-callback" */ "./pages/VnpayCallback")
);
const PaymentReceipt = lazy(() =>
  import(
    /* webpackChunkName: "payment-receipt" */ "./pages/payment/PaymentReceipt"
  )
);

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={1}
      />
      <Suspense fallback={<LoadingSpinner />}>
        {" "}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* VNPay callback - needs to be outside Layout for proper processing */}
          <Route path="/vnpay-callback" element={<VnpayCallback />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />

          {/* Dashboard routes for staff and higher */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute roleRequired="admin,manager,staff,consultant">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Public and customer routes with Layout */}
          <Route path="/" element={<Layout />}>
            {/* Các trang công khai */}
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:id" element={<BlogDetail />} />
            <Route path="consultants/:id" element={<ConsultantDetail />} />
            {/* Các trang STI Testing và Tracking */}
            <Route
              path="services/sti-testing"
              element={
                <ProtectedRoute roleRequired="customer">
                  <STITesting />
                </ProtectedRoute>
              }
            />
            <Route
              path="services/tracking"
              element={
                <ProtectedRoute roleRequired="customer">
                  <Tracking />
                </ProtectedRoute>
              }
            />
            <Route
              commentMore
              actions
              path="services/booking"
              element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              }
            />
            {/* Hệ thống thanh toán */}
            <Route path="payment" element={<Payment />} />
            <Route path="payment-success" element={<PaymentSuccess />} />
            <Route
              path="payment/receipt/:transactionId"
              element={<PaymentReceipt />}
            />
            {/* Trang hồ sơ khách hàng */}{" "}
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <CustomerProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile/:tab"
              element={
                <ProtectedRoute>
                  <CustomerProfile />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Redirect không hợp lệ URLs về trang chính */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
