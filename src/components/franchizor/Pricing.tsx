import React from 'react';
import Button from './Button';
import { Check } from 'lucide-react';

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
           <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Simple, transparent pricing.</h2>
           <p className="text-stone-600">Start for free, upgrade when you scale.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="p-8 rounded-2xl border border-stone-200 bg-stone-50/50 flex flex-col">
            <h3 className="text-xl font-bold text-stone-900 mb-2">Start Free</h3>
            <p className="text-stone-500 text-sm mb-6">Perfect for testing the waters.</p>
            <div className="text-4xl font-bold text-stone-900 mb-6">€0</div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-stone-700">
                <Check size={18} className="text-indigo-600" />
                <span>First <b>200 filled cells</b> free</span>
              </li>
              <li className="flex items-center gap-3 text-stone-700">
                <Check size={18} className="text-indigo-600" />
                <span>No credit card needed</span>
              </li>
              <li className="flex items-center gap-3 text-stone-700">
                <Check size={18} className="text-indigo-600" />
                <span>Standard processing speed</span>
              </li>
            </ul>

            <Button variant="secondary" fullWidth>Get Started</Button>
          </div>

          {/* Pro Plan */}
          <div className="p-8 rounded-2xl border-2 border-indigo-600 bg-white shadow-xl shadow-indigo-200/50 relative flex flex-col">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">Pro</h3>
            <p className="text-stone-500 text-sm mb-6">For power users and teams.</p>
            <div className="text-4xl font-bold text-stone-900 mb-6">€39<span className="text-lg font-normal text-stone-500">/mo</span></div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-stone-700">
                <Check size={18} className="text-indigo-600" />
                <span><b>Unlimited</b> rows</span>
              </li>
              <li className="flex items-center gap-3 text-stone-700">
                <Check size={18} className="text-indigo-600" />
                <span>Faster processing priority</span>
              </li>
              <li className="flex items-center gap-3 text-stone-700">
                <Check size={18} className="text-indigo-600" />
                <span>Verified emails</span>
              </li>
              <li className="flex items-center gap-3 text-stone-700">
                <Check size={18} className="text-indigo-600" />
                <span>Export to Google Sheets</span>
              </li>
            </ul>

            <Button variant="primary" fullWidth>Upgrade to Pro</Button>
          </div>
        </div>

        <div className="text-center mt-12 text-stone-500">
          <p>Need a team plan or enterprise features? <a href="#" className="text-indigo-600 font-medium underline decoration-indigo-200 underline-offset-2 hover:text-indigo-700">Let's talk.</a></p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;