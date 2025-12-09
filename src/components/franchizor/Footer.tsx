import React from 'react';
import { Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-stone-200 pt-16 pb-8">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
               <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-xs">L</div>
               <div className="leading-tight">
                 <span className="font-bold text-stone-900">Let me find it</span>
                 <div className="text-[11px] text-stone-500">by Franchizor</div>
               </div>
            </div>
            <p className="text-stone-500 text-sm">Let me find it for you.</p>
          </div>
          
          <div>
            <h4 className="font-bold text-stone-900 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">API (Soon)</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-4">Social</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-stone-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-400">
          <p>© {new Date().getFullYear()} Franchizor. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
             <span>Security</span>
             <span>Status</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;