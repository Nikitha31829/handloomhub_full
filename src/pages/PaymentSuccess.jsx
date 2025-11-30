import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function PaymentSuccess() {
  // small mount side-effect to improve perceived performance (optional)
  useEffect(() => {
    document.title = 'Payment Successful — HandloomHub';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1f1140] to-[#06202a] p-6">
      <div className="max-w-4xl w-full animate-fadeIn">
        <div className="relative rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden py-12 px-6 md:px-12">
          {/* confetti pieces */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-6 confetti" />
            <div className="absolute right-1/4 top-12 confetti delay-200" />
            <div className="absolute left-12 bottom-10 confetti delay-400" />
            <div className="absolute right-12 bottom-6 confetti delay-600" />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* left: status + check */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="relative">
                <div className="scale-up-check mx-auto md:mx-0 w-36 h-36 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center shadow-xl border border-white/10">
                  <svg className="w-16 h-16 text-white stroke-[3]" viewBox="0 0 48 48" fill="none" aria-hidden>
                    <path className="check-stroke" d="M12 24l8 8 16-16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {/* small confetti ring */}
                <div className="absolute -bottom-4 right-0 md:right-auto md:-bottom-6 md:left-3 w-6 h-6 rounded-full bg-pink-400/90 blur-[0.6px] animate-float" />
              </div>

              <h1 className="mt-6 text-3xl md:text-4xl font-extrabold text-white leading-tight">Payment Successful!</h1>
              <p className="mt-2 text-neutral-300 max-w-xl">
                Your order has been placed successfully. Thanks for supporting our artisans — we’ve received your payment and are preparing your order.
              </p>

              <div className="mt-6 flex gap-3">
                <Link to="/orders" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-shadow shadow-lg">
                  Track Order
                </Link>
                <Link to="/shop" className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/10 text-white/90 hover:bg-white/5 transition">
                  Continue Shopping
                </Link>
              </div>

              <div className="mt-6 text-sm text-neutral-400">
                Order #<span className="font-medium text-white">#{Math.random().toString(36).slice(2, 9).toUpperCase()}</span> • Estimated delivery: <span className="font-semibold text-white">3–7 business days</span>
              </div>
            </div>

            {/* right: progress card */}
            <div className="w-full md:w-96 bg-gradient-to-tr from-white/5 to-white/3 border border-white/10 rounded-2xl p-5 shadow-md text-sm text-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <div className="font-semibold text-white">Shipment Status</div>
                <div className="text-xs text-neutral-400">Order placed</div>
              </div>

              <div className="space-y-4">
                <ProgressStep title="Order Confirmed" desc="Payment received & order confirmed" state="done" />
                <ProgressStep title="Packed" desc="Preparing your package" state="pending" />
                <ProgressStep title="Out for Delivery" desc="On the way to you" state="pending" />
                <ProgressStep title="Delivered" desc="Delivered to your doorstep" state="pending" />
              </div>

              <div className="mt-6 text-xs text-neutral-400">
                You can track real-time updates in your Orders page. We’ll also send email & SMS updates.
              </div>
            </div>
          </div>
        </div>

        {/* subtle footer */}
        <div className="mt-6 text-center text-xs text-neutral-500">
          Need help? <a className="text-white/90 underline" href="/support">Contact support</a> — we’re here to help.
        </div>
      </div>

      {/* component-scoped CSS for animations */}
      <style>{`
        /* fade-in container */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0);} }
        .animate-fadeIn { animation: fadeIn 420ms ease-out both; }

        /* check icon scale/elastic */
        @keyframes scaleUp {
          0% { transform: scale(0.6); filter: blur(6px); opacity: 0; }
          60% { transform: scale(1.06); filter: blur(0); opacity: 1; }
          100% { transform: scale(1); }
        }
        .scale-up-check { animation: scaleUp 600ms cubic-bezier(.2,.9,.3,1) both; }

        /* check stroke draw animation */
        @keyframes drawCheck {
          0% { stroke-dashoffset: 40; stroke-dasharray: 40; opacity: 0.6; }
          100% { stroke-dashoffset: 0; stroke-dasharray: 40; opacity: 1; }
        }
        .check-stroke { animation: drawCheck 420ms cubic-bezier(.2,.9,.3,1) 200ms both; stroke: rgba(255,255,255,0.98); }

        /* floating confetti pieces */
        .confetti, .confetti::before, .confetti::after {
          width: 10px; height: 14px; border-radius: 2px;
          background: linear-gradient(45deg, #FFB86B, #FF6B6B);
          box-shadow: 0 2px 12px rgba(0,0,0,0.25);
          transform-origin: center;
          animation: confettiDrop 2200ms linear infinite;
        }
        .confetti.delay-200 { animation-delay: 200ms; }
        .confetti.delay-400 { animation-delay: 400ms; }
        .confetti.delay-600 { animation-delay: 600ms; }
        .confetti::before, .confetti::after {
          content: ''; position: absolute;
          background: linear-gradient(45deg, #7CE3D8, #6EE7B7);
        }
        .confetti::before { left: 14px; top: -6px; transform: rotate(20deg); width: 8px; height: 10px; }
        .confetti::after { left: -8px; top: -12px; transform: rotate(-10deg); width: 6px; height: 8px; }
        @keyframes confettiDrop {
          0% { transform: translateY(-8px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translateY(18px) rotate(60deg); }
          100% { transform: translateY(-6px) rotate(360deg); opacity: 0; }
        }

        /* subtle float for accent */
        @keyframes floaty { 0% { transform: translateY(0); } 50% { transform: translateY(-6px); } 100% { transform: translateY(0); } }
        .animate-float { animation: floaty 2.6s ease-in-out infinite; }

        @media (max-width: 640px) {
          .confetti { display: none; }
        }
      `}</style>
    </div>
  );
}

/* small helper for progress steps */
function ProgressStep({ title, desc, state = 'pending' }) {
  const done = state === 'done';
  return (
    <div className="flex items-start gap-3">
      <div className={`flex items-center justify-center w-9 h-9 rounded-full ${done ? 'bg-emerald-500' : 'bg-transparent border border-white/10'} shrink-0`}>
        {done ? (
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <div className="w-2 h-2 rounded-full bg-neutral-400/60" />
        )}
      </div>
      <div className="flex-1">
        <div className={`text-sm ${done ? 'text-white font-semibold' : 'text-neutral-300 font-medium'}`}>{title}</div>
        <div className="text-xs text-neutral-400 mt-1">{desc}</div>
      </div>
    </div>
  );
}
