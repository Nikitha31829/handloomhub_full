import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import FooterCTA from "./components/FooterCTA.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import Artisans from "./pages/Artisans.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Confirmed from "./pages/Confirmed.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ArtisanProfile from "./pages/ArtisanProfile.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Profile from "./pages/Profile.jsx";
import { useAuth } from "./state/AuthContext.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/artisan/:id" element={<ArtisanProfile />} />
          <Route path="/artisans" element={<Artisans />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
          <Route path="/confirmed" element={<Confirmed />} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <FooterCTA />
      <Footer />
    </div>
  );
}

function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
