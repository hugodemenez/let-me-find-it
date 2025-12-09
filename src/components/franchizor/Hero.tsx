import React from 'react';
import Button from './Button';
import { Sparkles, ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wide mb-6 animate-fade-in-up">
            <Sparkles size={14} className="text-indigo-500" />
            <span>AI Spreadsheet Filler</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-stone-900 tracking-tight mb-8 leading-[1.1] animate-fade-in-up [animation-delay:100ms]">
            Let me find it <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">for you.</span>
          </h1>

          <p className="text-lg md:text-xl text-stone-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up [animation-delay:200ms]">
            Add any missing column to your spreadsheet — CEO email, industry, company size, outreach copy, or anything else — and our AI fills every row automatically using the data you already have.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up [animation-delay:300ms]">
            <Button variant="primary" className="min-w-[160px] shadow-indigo-500/25">
              Start Free <ArrowRight size={18} className="ml-2" />
            </Button>
            <Button variant="secondary" className="min-w-[160px]">
              See Example Sheet
            </Button>
          </div>

          <p className="mt-6 text-sm text-stone-500 animate-fade-in-up [animation-delay:400ms]">
            No setup. No integrations. Just upload a file and name the column.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;