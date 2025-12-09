import React from 'react';
import { Zap, FileSpreadsheet, Briefcase } from 'lucide-react';

const ValueProps: React.FC = () => {
  const cards = [
    {
      icon: <Zap className="text-indigo-600" size={24} />,
      title: "The simplest way to complete your data",
      desc: "Add a column like “CEO Name” or “Industry” — the AI finds the right value for every row. No formulas. No manual research. No repetitive work."
    },
    {
      icon: <FileSpreadsheet className="text-indigo-600" size={24} />,
      title: "Works with any spreadsheet",
      desc: "Google Sheets, Excel, CSV — even messy spreadsheets. Just upload your file, we handle the chaos."
    },
    {
      icon: <Briefcase className="text-indigo-600" size={24} />,
      title: "Built for real workflows",
      desc: "Prospecting lists, CRM cleanup, finance enrichment, franchise operations — our AI adapts to your columns and your context."
    }
  ];

  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 hover:border-indigo-100 hover:shadow-indigo-500/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-4">{card.title}</h3>
              <p className="text-stone-600 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProps;