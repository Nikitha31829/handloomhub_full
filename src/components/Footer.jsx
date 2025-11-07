function IconMail(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" className="h-5 w-5" {...props}>
      <path d="M4 6h16v12H4z"/><path d="M22 6l-10 7L2 6"/>
    </svg>
  );
}
function IconPhone(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" className="h-5 w-5" {...props}>
      <path d="M22 16.92v2a2 2 0 0 1-2.18 2
               19.79 19.79 0 0 1-8.63-3.07
               19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.09 4.18
               2 2 0 0 1 4.11 2h2a2 2 0 0 1 2 1.72
               12.44 12.44 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 9.91
               a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45
               12.44 12.44 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}
function IconPin(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" className="h-5 w-5" {...props}>
      <path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 1 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#0E1726] text-neutral-300">
      <div className="container-px py-12 md:py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div>
          <h3 className="text-white text-xl font-extrabold mb-4">HandloomHub</h3>
          <p className="leading-relaxed">
            Connecting skilled artisans with buyers worldwide. Supporting
            traditional craftsmanship and sustainable fashion through authentic
            handloom products.
          </p>
          <div className="flex items-center gap-4 mt-5 text-white/80">
            <span className="text-xl"></span>
            <span className="text-xl"></span>
            <span className="text-xl"></span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/shop" className="hover:underline">Shop</a></li>
            <li><a href="/artisans" className="hover:underline">Artisans</a></li>
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-white font-bold mb-4">Customer Service</h4>
          <ul className="space-y-2">
            <li><a href="/faq" className="hover:underline">FAQ</a></li>
            <li><a href="/shipping" className="hover:underline">Shipping Info</a></li>
            <li><a href="/returns" className="hover:underline">Returns & Exchanges</a></li>
            <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:underline">Terms of Service</a></li>
          </ul>
        </div>

        {/* Newsletter / Contact */}
        <div>
          <h4 className="text-white font-bold mb-4">Stay Connected</h4>
          <p className="mb-3">
            Subscribe to our newsletter for updates on new artisans and exclusive offers.
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); alert("Subscribed!"); }}
            className="flex gap-2 mb-5"
          >
            <input
              type="email"
              className="field !bg-[#121E31] !text-white placeholder:text-neutral-400 flex-1"
              placeholder="Your email"
              required
            />
            <button className="btn-primary">Subscribe</button>
          </form>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <IconMail /> <a href="mailto:support@handloomhub.com" className="hover:underline">support@handloomhub.com</a>
            </div>
            <div className="flex items-center gap-2">
              <IconPhone /> <a href="tel:+15551234567" className="hover:underline">+91 81217 63647</a>
            </div>
            <div className="flex items-center gap-2">
              <IconPin /> <span>India, NY 10001</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-px py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm">© {new Date().getFullYear()} HandloomHub(@Nikhitha). All rights reserved.</p>
          <ul className="flex items-center gap-6 text-sm">
            <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:underline">Terms of Service</a></li>
            <li><a href="/cookies" className="hover:underline">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
