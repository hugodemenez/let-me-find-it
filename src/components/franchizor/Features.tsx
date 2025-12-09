import React from 'react';
import { CheckCircle2, Search, Zap, Layout } from 'lucide-react';

const Features: React.FC = () => {
  const featureList = [
    {
      title: "Generate a new column in seconds",
      icon: <Zap className="text-indigo-600" size={20} />,
      items: [
        "CEO / Founder names",
        "Work emails & LinkedIn URLs",
        "Company size / sector / HQ",
        "Personalized outreach (per row!)",
        "Franchise owner contact details",
      ]
    },
    {
      title: "Understands context",
      icon: <Search className="text-indigo-600" size={20} />,
      items: [
        "Company Name + Website → CEO email",
        "Location + Brand → Franchise owner",
        "URL + Description → Industry",
        "Smart inference from existing data",
        "Validates against external signals"
      ]
    }
  ];

  return (
    <section id="features" className="py-24 bg-cream overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <div className="inline-block px-3 py-1 bg-indigo-50 rounded-full text-indigo-600 text-sm font-semibold mb-6">
              Powerful Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6 leading-tight">
              Turn a single hint into <br/> fully enriched data.
            </h2>
            <p className="text-lg text-stone-600 mb-10">
              Stop manually researching row by row. Our AI understands the context of your spreadsheet and fills in the blanks instantly.
            </p>

            <div className="space-y-10">
              {featureList.map((feature, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-stone-900">{feature.title}</h3>
                  </div>
                  <ul className="space-y-2 pl-2">
                    {feature.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-stone-600">
                        <CheckCircle2 size={18} className="text-green-500 mt-1 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
             {/* Abstract visual representation of feature richness */}
             <div className="relative z-10 bg-indigo-900 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-900/30 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-8 border-b border-indigo-700 pb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="text-indigo-300 text-sm font-mono">Data_Enrichment_v2.csv</div>
                </div>
                
                <div className="space-y-4 font-mono text-sm">
                   <div className="flex justify-between text-indigo-400 text-xs uppercase tracking-wider">
                      <span>Input</span>
                      <span>AI Output</span>
                   </div>
                   <div className="flex items-center justify-between p-3 bg-indigo-800/50 rounded-lg border border-indigo-700">
                      <span className="opacity-80">Apple Inc.</span>
                      <span className="text-green-400">tim@apple.com</span>
                   </div>
                   <div className="flex items-center justify-between p-3 bg-indigo-800/50 rounded-lg border border-indigo-700">
                      <span className="opacity-80">Tesla</span>
                      <span className="text-green-400">Automotive</span>
                   </div>
                   <div className="flex items-center justify-between p-3 bg-indigo-800/50 rounded-lg border border-indigo-700">
                      <span className="opacity-80">Paris, France</span>
                      <span className="text-green-400">EU Headquarters</span>
                   </div>
                   <div className="flex items-center justify-between p-3 bg-indigo-800/50 rounded-lg border border-indigo-700">
                      <span className="opacity-80">Subway #402</span>
                      <span className="text-green-400">John Doe (Owner)</span>
                   </div>
                </div>

                <div className="mt-8 pt-6 border-t border-indigo-700 text-center">
                   <p className="text-indigo-300 mb-2">Processing...</p>
                   <div className="w-full h-2 bg-indigo-800 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-green-400 rounded-full"></div>
                   </div>
                </div>
             </div>
             
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-200 rounded-full blur-3xl opacity-30"></div>
             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-200 rounded-full blur-3xl opacity-30"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;