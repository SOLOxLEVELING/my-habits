import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, BarChart, TrendingUp, ArrowRight, Shield, Zap, Layout } from "lucide-react";

export default function LandingPage({ onNavigateToRegister, onNavigateToLogin }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span>My Habits</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateToLogin}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Log in
            </button>
            <button
              onClick={onNavigateToRegister}
              className="text-sm font-medium bg-white text-slate-950 px-4 py-2 rounded-full hover:bg-blue-50 transition-colors"
            >
              Sign up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-800 text-blue-300 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            v1.0 is now live
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            Master Your Routine. <br />
            <span className="text-blue-500">Build Better Habits.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The minimalist habit tracker designed for focus and consistency. 
            Track your daily goals, visualize your progress, and build streaks that last.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onNavigateToRegister}
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-blue-600 px-8 font-medium text-white transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]"
            >
              <span className="mr-2">Start Tracking Free</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={onNavigateToLogin}
              className="inline-flex h-12 items-center justify-center rounded-full px-8 font-medium text-slate-300 transition-colors hover:text-white hover:bg-slate-800"
            >
              Existing User?
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-slate-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to stay on track</h2>
            <p className="text-slate-400">Simple, powerful tools to help you build the life you want.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Layout className="w-6 h-6 text-blue-400" />}
              title="Daily Dashboard"
              description="A clean, distraction-free view of your daily tasks. Check off habits with a satisfying click."
            />
            <FeatureCard 
              icon={<BarChart className="w-6 h-6 text-purple-400" />}
              title="Progress Analytics"
              description="Visualize your consistency with beautiful charts and heatmaps. See how far you've come."
            />
            <FeatureCard 
              icon={<TrendingUp className="w-6 h-6 text-emerald-400" />}
              title="Streak Tracking"
              description="Keep the momentum going. Watch your streaks grow and stay motivated to never break the chain."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 border-t border-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Simple by design.</h2>
              <div className="space-y-8">
                <Step 
                  number="01" 
                  title="Create your habits" 
                  desc="Define what you want to achieve. Set daily, weekly, or custom schedules."
                />
                <Step 
                  number="02" 
                  title="Track daily" 
                  desc="Log your progress in seconds. Add notes to reflect on your journey."
                />
                <Step 
                  number="03" 
                  title="Review & Improve" 
                  desc="Analyze your data to understand your patterns and optimize your routine."
                />
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-20" />
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
                {/* Mock UI */}
                <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                  <div className="w-20 h-4 bg-slate-800 rounded" />
                  <div className="w-8 h-8 bg-blue-600/20 rounded-full" />
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                      <div className={`w-5 h-5 rounded border ${i === 1 ? 'bg-blue-500 border-blue-500' : 'border-slate-600'}`} />
                      <div className="w-32 h-3 bg-slate-700 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/10" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Ready to transform your habits?</h2>
          <p className="text-slate-400 mb-8 text-lg">Join today and start building the consistency you've always wanted.</p>
          <button
            onClick={onNavigateToRegister}
            className="bg-white text-slate-950 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-xl"
          >
            Get Started for Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-900 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} My Habits. Built for consistency.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors group">
      <div className="mb-4 p-3 bg-slate-950 rounded-xl inline-block group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-slate-100">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ number, title, desc }) {
  return (
    <div className="flex gap-4">
      <div className="text-blue-500 font-mono font-bold text-xl">{number}</div>
      <div>
        <h4 className="text-lg font-bold text-slate-200 mb-1">{title}</h4>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
