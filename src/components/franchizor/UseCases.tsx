import React from 'react';

const UseCases: React.FC = () => {
  const cases = [
    { title: "For Sales & Growth", desc: "Turn a list of companies into a list of qualified decision-makers." },
    { title: "For CRM & Ops", desc: "Fill missing fields across messy datasets without hours of manual cleanup." },
    { title: "For Founders", desc: "Build investor lists, hiring lists, company enrichment sheets, and more — at scale." },
    { title: "For Agencies", desc: "Automate research-heavy spreadsheets for clients." },
    { title: "For Franchise Networks", desc: "Enrich prospect lists with owner details, contact emails, and contextual insights." }
  ];

  return (
    <section className="py-24 bg-cream">
      <div className="container mx-auto px-6 max-w-7xl">
        <h2 className="text-3xl font-bold text-stone-900 mb-12 text-center">Built for every team</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((item, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 hover:border-indigo-200 hover:shadow-md transition-all duration-200"
            >
              <h3 className="text-lg font-bold text-indigo-900 mb-2">{item.title}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
          {/* Call to action card */}
          <div className="bg-indigo-600 p-6 rounded-xl shadow-lg shadow-indigo-500/30 flex flex-col justify-center items-center text-center text-white">
            <h3 className="text-lg font-bold mb-2">Have a unique use case?</h3>
            <p className="text-indigo-100 text-sm mb-4">Our AI adapts to your context.</p>
            <button className="text-xs font-bold uppercase tracking-wider bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors">
              Try it free
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;