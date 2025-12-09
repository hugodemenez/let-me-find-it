import React from 'react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Upload your spreadsheet",
      desc: "No formatting required. We analyze your columns instantly."
    },
    {
      num: "02",
      title: "Add the column you need",
      desc: 'Type "CEO Email", "Category", "Size", "LinkedIn URL", "Outreach Email", or anything else.'
    },
    {
      num: "03",
      title: "Let AI fill every row",
      desc: "Each value is generated intelligently using data relationships inside your sheet + external signals."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative vertical line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-stone-200 to-transparent hidden md:block"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Simple. Fast. Magical.</h2>
          <p className="text-lg text-stone-600">Three steps to perfect data.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-white border-2 border-stone-100 shadow-lg flex items-center justify-center text-xl font-bold text-indigo-600 mb-8 z-10 group-hover:border-indigo-600 group-hover:scale-110 transition-all duration-300">
                {step.num}
              </div>
              
              <h3 className="text-xl font-bold text-stone-900 mb-3">{step.title}</h3>
              <p className="text-stone-600 max-w-xs mx-auto">{step.desc}</p>
              
              {/* Connector line for mobile */}
              {index < 2 && (
                <div className="absolute -bottom-8 left-1/2 w-px h-8 bg-stone-200 md:hidden"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;