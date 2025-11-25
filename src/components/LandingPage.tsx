import React from 'react';
import { Store, ShoppingBag, MapPin, Zap, UtensilsCrossed, DollarSign, Shield, Smartphone } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImage from 'figma:asset/d393b9f0ee4445ba8a726796522f801553480002.png';

interface LandingPageProps {
  onNavigate: (view: 'restaurant' | 'customer') => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#0F1825]">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] border-b border-[#334155] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl text-white">NomNomNow</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-white/90">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="#team" className="hover:text-white transition-colors">Our Team</a>
              <button onClick={() => onNavigate('restaurant')} className="hover:text-white transition-colors">Restaurants</button>
              <button onClick={() => onNavigate('customer')} className="hover:text-white transition-colors">Customer</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-[#1A2332] py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-white mb-3 flex justify-center">
            <img src={logoImage} alt="NomNomNow" className="h-40" />
          </h1>
          <p className="text-2xl text-white/90 mb-0">
            Your favorite food, delivered fast
          </p>
        </div>
      </section>

      {/* View Selection */}
      <section id="customer" className="py-8 bg-[#0F1825] scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-white mb-10">Get Started</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Customer View */}
            <button
              onClick={() => onNavigate('customer')}
              className="group bg-[#1E293B] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border-2 border-[#334155] hover:border-[#10B981]"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
              <h3 className="mb-3 text-white">Customer View</h3>
              <p className="text-[#9CA3AF] mb-6">
                Browse restaurants, place orders, and track your delivery
              </p>
              <div className="inline-block px-6 py-3 bg-[#10B981] text-white rounded-lg border-2 border-[#059669] group-hover:bg-[#059669] transition-colors">
                Order Now
              </div>
            </button>

            {/* Restaurant View */}
            <button
              onClick={() => onNavigate('restaurant')}
              className="group bg-[#1E293B] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border-2 border-[#334155] hover:border-[#3B82F6]"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Store className="w-10 h-10 text-white" />
              </div>
              <h3 className="mb-3 text-white">Restaurant View</h3>
              <p className="text-[#9CA3AF] mb-6">
                Manage your restaurant profile, update your menu, and add new dishes
              </p>
              <div className="inline-block px-6 py-3 bg-[#3B82F6] text-white rounded-lg border-2 border-[#2563EB] group-hover:bg-[#2563EB] transition-colors">
                Manage Restaurant
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 bg-[#1A2332] scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-white mb-12">
            Why Choose NomNomNow?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Area-Based Delivery */}
            <div className="bg-[#1E293B] rounded-xl p-6 border border-[#334155]/10 hover:border-[#10B981] transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-center text-white mb-3">Area-Based Delivery</h3>
              <p className="text-[#9CA3AF] text-center">
                Browse restaurants and meals available in your specific delivery area
              </p>
            </div>

            {/* Feature 2: Lightning Fast */}
            <div className="bg-[#1E293B] rounded-xl p-6 border border-[#334155]/10 hover:border-[#3B82F6] transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-center text-white mb-3">Lightning Fast</h3>
              <p className="text-[#9CA3AF] text-center">
                Powered by serverless Azure architecture for instant order processing
              </p>
            </div>

            {/* Feature 3: Multiple Restaurants */}
            <div className="bg-[#1E293B] rounded-xl p-6 border border-[#334155]/10 hover:border-[#10B981] transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-lg flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-center text-white mb-3">Multiple Restaurants</h3>
              <p className="text-[#9CA3AF] text-center">
                Order from different restaurants in a single delivery
              </p>
            </div>

            {/* Feature 4: Transparent Pricing */}
            <div className="bg-[#1E293B] rounded-xl p-6 border border-[#334155]/10 hover:border-[#3B82F6] transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-lg flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-center text-white mb-3">Transparent Pricing</h3>
              <p className="text-[#9CA3AF] text-center">
                See exact costs and delivery times before you order
              </p>
            </div>

            {/* Feature 5: Secure & Reliable */}
            <div className="bg-[#1E293B] rounded-xl p-6 border border-[#334155]/10 hover:border-[#10B981] transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-center text-white mb-3">Secure & Reliable</h3>
              <p className="text-[#9CA3AF] text-center">
                Built on Microsoft Azure cloud infrastructure
              </p>
            </div>

            {/* Feature 6: Easy to Use */}
            <div className="bg-[#1E293B] rounded-xl p-6 border border-[#334155]/10 hover:border-[#3B82F6] transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-center text-white mb-3">Easy to Use</h3>
              <p className="text-[#9CA3AF] text-center">
                Simple, intuitive interface that works on any device
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#0F1825] scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-white mb-16">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl text-white">1</span>
              </div>
              <h3 className="text-white mb-4">Create Your Profile</h3>
              <p className="text-[#9CA3AF]">
                Tell us who you are and where you are — so we can show you restaurants that deliver to you.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl text-white">2</span>
              </div>
              <h3 className="text-white mb-4">Discover Great Food</h3>
              <p className="text-[#9CA3AF]">
                Browse a curated list of restaurants in your area and beyond.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl text-white">3</span>
              </div>
              <h3 className="text-white mb-4">Mix & Match Meals</h3>
              <p className="text-[#9CA3AF]">
                Add dishes from different restaurants into one easy order.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl text-white">4</span>
              </div>
              <h3 className="text-white mb-4">Confirm & Relax</h3>
              <p className="text-[#9CA3AF]">
                Review your cart, check your delivery time, and place your order. We'll handle the rest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-[#1A2332] scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-white mb-16">
            Our Team - Group 2
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Team Member 1 */}
            <div className="bg-[#1E293B] rounded-lg p-6 border-l-4 border-[#3B82F6] hover:shadow-lg transition-shadow">
              <h3 className="text-white mb-2">Kiril Petrovski</h3>
              <p className="text-[#9CA3AF]">
                Milestone 1: Project Bootstrap & Setup
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="bg-[#1E293B] rounded-lg p-6 border-l-4 border-[#3B82F6] hover:shadow-lg transition-shadow">
              <h3 className="text-white mb-2">Nicolás Daniel Grass López de Silanes</h3>
              <p className="text-[#9CA3AF]">
                Milestone 2: Restaurant Ecosystem & Data
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="bg-[#1E293B] rounded-lg p-6 border-l-4 border-[#3B82F6] hover:shadow-lg transition-shadow">
              <h3 className="text-white mb-2">Rodrigo Blanco Maldonado</h3>
              <p className="text-[#9CA3AF]">
                Milestone 3: Frontend Design & UI
              </p>
            </div>

            {/* Team Member 4 */}
            <div className="bg-[#1E293B] rounded-lg p-6 border-l-4 border-[#3B82F6] hover:shadow-lg transition-shadow">
              <h3 className="text-white mb-2">Ali Ahmad Lutfi Samara</h3>
              <p className="text-[#9CA3AF]">
                Milestone 4: Azure Functions Integration
              </p>
            </div>

            {/* Team Member 5 */}
            <div className="bg-[#1E293B] rounded-lg p-6 border-l-4 border-[#3B82F6] hover:shadow-lg transition-shadow">
              <h3 className="text-white mb-2">Iciar Adeliño Ordax</h3>
              <p className="text-[#9CA3AF]">
                Milestone 5: Final Polish & Presentation
              </p>
            </div>

            {/* Team Member 6 */}
            <div className="bg-[#1E293B] rounded-lg p-6 border-l-4 border-[#3B82F6] hover:shadow-lg transition-shadow">
              <h3 className="text-white mb-2">Christoph Rintz</h3>
              <p className="text-[#9CA3AF]">
                Milestone 6: Advanced Features & Enhancements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#374151] border-t border-[#4B5563] py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-white mb-1 text-lg">
            NomNomNow <span className="text-white/70">- A Cloud Computing Project</span>
          </h2>
          <p className="text-white/80 mb-4 text-sm">
            IE University | Fall 2025 | Group 2
          </p>
          
          {/* Technology Badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <span className="px-3 py-1 bg-[#4B5563] text-white/90 rounded-full text-xs">
              Azure Functions
            </span>
            <span className="px-3 py-1 bg-[#4B5563] text-white/90 rounded-full text-xs">
              Azure Storage
            </span>
            <span className="px-3 py-1 bg-[#4B5563] text-white/90 rounded-full text-xs">
              GitHub Pages
            </span>
            <span className="px-3 py-1 bg-[#4B5563] text-white/90 rounded-full text-xs">
              Python
            </span>
          </div>
          
          <p className="text-white/60 text-xs">
            For educational purposes only
          </p>
        </div>
      </footer>
    </div>
  );
}