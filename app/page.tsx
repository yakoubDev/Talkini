'use client'
import { useUser } from "@/store/authStore";
import Link from "next/link";

const Home = () => {
  const user = useUser();
  return (
    <main className="min-h-[93dvh] bg-slate-900 flex items-center justify-center page-paddings">
      <div className="max-w-5xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-8xl  font-bold bg-linear-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
            Chat with Talkini
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-xl mx-auto">
            Connect and chat with friends in real-time. Simple, fast, and secure
            messaging.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
          <Link href={`${user ? "/friends"  : "/signup"}`}>
            <button className="btn bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/20 px-8 py-3 text-lg">
              Get Started
            </button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-3 hover:border-slate-600 transition-all">
            <div className="text-4xl">⚡</div>
            <h3 className="text-xl font-semibold text-slate-100">
              Lightning Fast
            </h3>
            <p className="text-slate-400">
              Real-time messaging with instant delivery
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-3 hover:border-slate-600 transition-all">
            <div className="text-4xl">🔒</div>
            <h3 className="text-xl font-semibold text-slate-100">Secure</h3>
            <p className="text-slate-400">
              Your conversations stay private and protected
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-3 hover:border-slate-600 transition-all">
            <div className="text-4xl">🌐</div>
            <h3 className="text-xl font-semibold text-slate-100">Anywhere</h3>
            <p className="text-slate-400">
              Chat from any device, anytime, anywhere
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
