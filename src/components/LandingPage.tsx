import { Store, ShoppingBag, MapPin, Zap, UtensilsCrossed, DollarSign, Shield, Smartphone } from 'lucide-react';
import logoImage from "../assets/new_logo.png";

interface LandingPageProps {
  onNavigate: (view: 'restaurant' | 'customer') => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logoImage} alt="NomNomNow" className="h-10" />
              <span className="text-2xl text-[#1a1a1a] font-bold">NomNomNow</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
              <a href="#features" className="hover:text-[#fc542e] transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-[#fc542e] transition-colors">How It Works</a>
              <a href="#team" className="hover:text-[#fc542e] transition-colors">Our Team</a>
              <button onClick={() => onNavigate('restaurant')} className="hover:text-[#fc542e] transition-colors">Restaurants</button>
              <button onClick={() => onNavigate('customer')} className="px-6 py-2 bg-[#fc542e] text-white rounded-full font-semibold hover:bg-[#e64820] transition-colors shadow-md">
                Order Now
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#fff5f2] to-white py-20 relative overflow-hidden">
        {/* decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#fc542e]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#fc542e]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          {/* logo at the top */}
          <div className="flex justify-center items-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-[#fc542e]/10 rounded-full blur-2xl animate-pulse"></div>
              <img src={logoImage} alt="NomNomNow" className="h-40 relative z-10 drop-shadow-2xl" />
            </div>
          </div>
          
          {/* centered text content */}
          <h1 className="text-5xl md:text-6xl text-[#1a1a1a] font-bold mb-6 leading-tight">
            Your favorite food,<br />
            <span className="text-[#fc542e]">delivered fast</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Order from multiple restaurants in one delivery. Fresh, fast, and hassle-free.
          </p>
          
          {/* centered buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => onNavigate('customer')}
              className="px-8 py-4 bg-[#fc542e] text-white rounded-full font-bold text-lg hover:bg-[#e64820] transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Order Now
            </button>
            <button 
              onClick={() => onNavigate('restaurant')}
              className="px-8 py-4 bg-white text-[#fc542e] border-2 border-[#fc542e] rounded-full font-bold text-lg hover:bg-[#fc542e] hover:text-white transition-all"
            >
              Partner With Us
            </button>
          </div>
        </div>
      </section>

      {/* View Selection */}
      <section id="customer" className="py-16 bg-gray-50 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-[#1a1a1a] mb-4 font-bold">Get Started</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Choose your experience</p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Customer View */}
            <button
              onClick={() => onNavigate('customer')}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-gray-200 hover:border-[#fc542e]"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-[#fc542e] to-[#e64820] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
              <h3 className="mb-3 text-[#1a1a1a] font-bold">Customer View</h3>
              <p className="text-gray-600 mb-6">
                Browse restaurants, place orders, and track your delivery
              </p>
              <div className="inline-block px-6 py-3 bg-[#fc542e] text-white rounded-lg font-semibold group-hover:bg-[#e64820] transition-colors">
                Order Now
              </div>
            </button>

            {/* Restaurant View */}
            <button
              onClick={() => onNavigate('restaurant')}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-gray-200 hover:border-[#fc542e]"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-[#fc542e] to-[#e64820] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Store className="w-10 h-10 text-white" />
              </div>
              <h3 className="mb-3 text-[#1a1a1a] font-bold">Restaurant View</h3>
              <p className="text-gray-600 mb-6">
                Manage your restaurant profile, update your menu, and add new dishes
              </p>
              <div className="inline-block px-6 py-3 bg-[#fc542e] text-white rounded-lg font-semibold group-hover:bg-[#e64820] transition-colors">
                Manage Restaurant
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-[#1a1a1a] mb-4 font-bold">
            Why Choose NomNomNow?
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Everything you need for the perfect food delivery experience</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Area-Based Delivery */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#fc542e] hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-[#fc542e] to-[#e64820] rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-center text-[#1a1a1a] mb-3 font-semibold">Area-Based Delivery</h3>
              <p className="text-gray-600 text-center">
                Browse restaurants and meals available in your specific delivery area
              </p>
            </div>

            {/* Feature 2: Lightning Fast */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#fc542e] hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-[#fc542e] to-[#e64820] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-center text-[#1a1a1a] mb-3 font-semibold">Lightning Fast</h3>
              <p className="text-gray-600 text-center">
                Powered by serverless Azure architecture for instant order processing
              </p>
            </div>

            {/* Feature 3: Multiple Restaurants */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#fc542e] hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-[#fc542e] to-[#e64820] rounded-lg flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-center text-[#1a1a1a] mb-3 font-semibold">Multiple Restaurants</h3>
              <p className="text-gray-600 text-center">
                Order from different restaurants in a single delivery
              </p>
            </div>

            {/* Feature 4: Transparent Pricing */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#fc542e] hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-[#fc542e] to-[#e64820] rounded-lg flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-center text-[#1a1a1a] mb-3 font-semibold">Transparent Pricing</h3>
              <p className="text-gray-600 text-center">
                See exact costs and delivery times before you order
              </p>
            </div>

            {/* Feature 5: Secure & Reliable */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#fc542e] hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-[#fc542e] to-[#e64820] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-center text-[#1a1a1a] mb-3 font-semibold">Secure & Reliable</h3>
              <p className="text-gray-600 text-center">
                Built on Microsoft Azure cloud infrastructure
              </p>
            </div>

            {/* Feature 6: Easy to Use */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#fc542e] hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-[#fc542e] to-[#e64820] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-center text-[#1a1a1a] mb-3 font-semibold">Easy to Use</h3>
              <p className="text-gray-600 text-center">
                Simple, intuitive interface that works on any device
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-[#1a1a1a] mb-4 font-bold">
            How It Works
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg">Four simple steps to delicious food</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#fc542e] to-[#e64820] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl text-white font-bold">1</span>
              </div>
              <h3 className="text-[#1a1a1a] mb-4 font-semibold">Create Your Profile</h3>
              <p className="text-gray-600">
                Tell us who you are and where you are — so we can show you restaurants that deliver to you.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#fc542e] to-[#e64820] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl text-white font-bold">2</span>
              </div>
              <h3 className="text-[#1a1a1a] mb-4 font-semibold">Discover Great Food</h3>
              <p className="text-gray-600">
                Browse a curated list of restaurants in your area and beyond.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#fc542e] to-[#e64820] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl text-white font-bold">3</span>
              </div>
              <h3 className="text-[#1a1a1a] mb-4 font-semibold">Mix & Match Meals</h3>
              <p className="text-gray-600">
                Add dishes from different restaurants into one easy order.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#fc542e] to-[#e64820] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl text-white font-bold">4</span>
              </div>
              <h3 className="text-[#1a1a1a] mb-4 font-semibold">Confirm & Relax</h3>
              <p className="text-gray-600">
                Review your cart, check your delivery time, and place your order. We'll handle the rest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-[#1a1a1a] mb-4 font-bold">
            Our Team - Group 2
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg">The people behind NomNomNow</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Team Member 1 */}
            <div className="bg-white rounded-lg p-6 border-l-4 border-[#fc542e] shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-[#1a1a1a] mb-2 font-semibold">Kiril Petrovski</h3>
              <p className="text-gray-600">
                Milestone 1: Project Bootstrap & Setup
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-lg p-6 border-l-4 border-[#fc542e] shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-[#1a1a1a] mb-2 font-semibold">Nicolás Daniel Grass López de Silanes</h3>
              <p className="text-gray-600">
                Milestone 2: Restaurant Ecosystem & Data
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-lg p-6 border-l-4 border-[#fc542e] shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-[#1a1a1a] mb-2 font-semibold">Rodrigo Blanco Maldonado</h3>
              <p className="text-gray-600">
                Milestone 3: Frontend Design & UI
              </p>
            </div>

            {/* Team Member 4 */}
            <div className="bg-white rounded-lg p-6 border-l-4 border-[#fc542e] shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-[#1a1a1a] mb-2 font-semibold">Ali Ahmad Lutfi Samara</h3>
              <p className="text-gray-600">
                Milestone 4: Azure Functions Integration
              </p>
            </div>

            {/* Team Member 5 */}
            <div className="bg-white rounded-lg p-6 border-l-4 border-[#fc542e] shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-[#1a1a1a] mb-2 font-semibold">Iciar Adeliño Ordax</h3>
              <p className="text-gray-600">
                Milestone 5: Final Polish & Presentation
              </p>
            </div>

            {/* Team Member 6 */}
            <div className="bg-white rounded-lg p-6 border-l-4 border-[#fc542e] shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-[#1a1a1a] mb-2 font-semibold">Christoph Rintz</h3>
              <p className="text-gray-600">
                Milestone 6: Advanced Features & Enhancements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-[#1a1a1a] mb-1 text-lg font-bold">
            NomNomNow <span className="text-gray-600 font-normal">- A Cloud Computing Project</span>
          </h2>
          <p className="text-gray-600 mb-4 text-sm">
            IE University | Fall 2025 | Group 2
          </p>
          
          {/* Technology Badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <span className="px-3 py-1 bg-[#fc542e]/10 text-[#fc542e] border border-[#fc542e] rounded-full text-xs font-medium">
              Azure Functions
            </span>
            <span className="px-3 py-1 bg-[#fc542e]/10 text-[#fc542e] border border-[#fc542e] rounded-full text-xs font-medium">
              Azure Storage
            </span>
            <span className="px-3 py-1 bg-[#fc542e]/10 text-[#fc542e] border border-[#fc542e] rounded-full text-xs font-medium">
              GitHub Pages
            </span>
            <span className="px-3 py-1 bg-[#fc542e]/10 text-[#fc542e] border border-[#fc542e] rounded-full text-xs font-medium">
              Python
            </span>
          </div>
          
          <p className="text-gray-500 text-xs">
            For educational purposes only
          </p>
        </div>
      </footer>
    </div>
  );
}