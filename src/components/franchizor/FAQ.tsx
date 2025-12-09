'use client'

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-stone-200 last:border-0">
      <button 
        className="w-full flex justify-between items-center py-6 text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-stone-900">{question}</span>
        {isOpen ? <ChevronUp className="text-stone-400" /> : <ChevronDown className="text-stone-400" />}
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-stone-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "Does it work with any spreadsheet?",
      answer: "Yes — Google Sheets, Excel, CSV, downloads from CRMs, exports from internal tools, and more. If it has rows and columns, we can fill it."
    },
    {
      question: "What kind of data can it find?",
      answer: "Anything that can be inferred from your existing columns + publicly available signals. This includes emails, names, metadata, tags, industry classifications, outreach text, and more."
    },
    {
      question: "Is the data accurate?",
      answer: "Yes. The system combines structured inference, live web signals, and validation rules to ensure high confidence in every cell we fill."
    },
    {
      question: "Do I need technical setup?",
      answer: "Zero. Just upload a spreadsheet and type the name of the column you want to fill. We handle the backend complexity."
    }
  ];

  return (
    <section className="py-24 bg-cream">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-3xl font-bold text-stone-900 mb-10 text-center">Frequently Asked Questions</h2>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;