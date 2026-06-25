import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center text-white p-4">
      {/* Abstract Architectural Background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 2px, transparent 0)', backgroundSize: '48px 48px' }}></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      
      <div className="relative z-10 text-center space-y-8 max-w-3xl mx-auto flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 mb-4">
          <Building className="h-8 w-8 text-white" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Civil Construction <span className="text-blue-500">SaaS</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl">
          The complete project management platform designed for modern contractors. Streamline materials, workforce, and project delivery.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link href="/login" className="w-full sm:w-auto">
            <Button size="lg" className="w-full h-12 px-8 text-base font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">
              Login to Account <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full h-12 px-8 text-base font-semibold border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm">
              View Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
