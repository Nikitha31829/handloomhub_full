import { Link, useLocation } from 'react-router-dom';

export default function Confirmed() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-sky-50">
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-xl overflow-hidden">
        {/* glow */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-44 w-44 rounded-full bg-sky-200/40 blur-3xl" />

        {/* animated check */}
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="mb-4">
            <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center animate-[bounce_1.5s_ease-out]">
              <div className="h-14 w-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                <span className="text-white text-3xl">✓</span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-neutral-900">
            Payment Successful
          </h1>
          <p className="mt-2 text-neutral-600 max-w-md">
            Thank you for shopping with HandloomHub. Your handcrafted pieces are being prepared with care.
          </p>

          {orderId && (
            <p className="mt-3 text-sm text-neutral-500">
              Order ID: <span className="font-mono font-semibold text-neutral-700">{orderId}</span>
            </p>
          )}

          {/* status */}
          <div className="mt-8 w-full">
            <div className="flex items-center justify-between text-xs font-medium text-neutral-500">
              <span>Order confirmed</span>
              <span>Packed</span>
              <span>Out for delivery</span>
              <span>Delivered</span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
              <div className="h-full w-1/4 rounded-full bg-emerald-500 animate-[pulse_2s_infinite]" />
            </div>
          </div>

          {/* buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-3 w-full">
            <Link
              to="/orders"
              className="flex-1 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition"
            >
              Track Order
            </Link>
            <Link
              to="/shop"
              className="flex-1 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold border border-neutral-200 text-neutral-800 bg-white hover:bg-neutral-50 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
