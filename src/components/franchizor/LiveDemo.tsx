'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Check } from 'lucide-react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';

interface RowData {
  company: string;
  website: string;
  autoValue: string;
  userValue: string;
}

const baseRows: RowData[] = [
  { company: 'Airbnb', website: 'airbnb.com', autoValue: 'brian@airbnb.com', userValue: 'Travel & Hospitality' },
  { company: 'Stripe', website: 'stripe.com', autoValue: 'patrick@stripe.com', userValue: 'Fintech' },
  { company: 'Figma', website: 'figma.com', autoValue: 'dylan@figma.com', userValue: 'Design SaaS' },
  { company: 'Notion', website: 'notion.so', autoValue: 'ivan@notion.so', userValue: 'Productivity' },
  { company: 'Linear', website: 'linear.app', autoValue: 'karri@linear.app', userValue: 'Developer Tools' },
];

const columnHelper = createColumnHelper<RowData>();

const LiveDemo: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const [autoIsPlaying, setAutoIsPlaying] = useState(false);
  const [autoProgress, setAutoProgress] = useState(0);
  const [hasAutoplayed, setHasAutoplayed] = useState(false);

  const [userInput, setUserInput] = useState('Industry');
  const [userLabel, setUserLabel] = useState('Industry');
  const [userIsPlaying, setUserIsPlaying] = useState(false);
  const [userProgress, setUserProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const rowCount = useMemo(() => baseRows.length, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (autoIsPlaying && autoProgress < rowCount) {
      interval = setInterval(() => {
        setAutoProgress((prev) => prev + 1);
      }, 600);
    } else if (autoProgress >= rowCount) {
      setAutoIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [autoIsPlaying, autoProgress, rowCount]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (userIsPlaying && userProgress < rowCount) {
      interval = setInterval(() => {
        setUserProgress((prev) => prev + 1);
      }, 600);
    } else if (userProgress >= rowCount) {
      setUserIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [userIsPlaying, userProgress, rowCount]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasAutoplayed) {
          setAutoProgress(0);
          setAutoIsPlaying(true);
          setHasAutoplayed(true);
        }
      },
      { threshold: 0.35 }
    );

    const node = sectionRef.current;
    if (node) observer.observe(node);
    return () => observer.disconnect();
  }, [hasAutoplayed]);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const label = userInput.trim() || 'Custom Column';
    setUserLabel(label);
    setUserProgress(0);
    setUserIsPlaying(true);
  };

  const columns: ColumnDef<RowData, any>[] = useMemo(() => {
    const baseColumns: ColumnDef<RowData, any>[] = [
      columnHelper.display({
        id: 'index',
        size: 56,
        minSize: 48,
        header: '#',
        cell: (info) => <span className="text-stone-400 font-mono">{info.row.index + 1}</span>,
      }),
      columnHelper.accessor('company', {
        id: 'company',
        header: 'Company Name',
        size: 120,
        minSize: 100,
        maxSize: 200,
        cell: (info) => <span className="font-medium truncate whitespace-nowrap">{info.getValue()}</span>,
      }),
      columnHelper.accessor('website', {
        id: 'website',
        header: 'Website',
        size: 160,
        minSize: 120,
        maxSize: 220,
        cell: (info) => <span className="text-stone-600 truncate whitespace-nowrap">{info.getValue()}</span>,
      }),
      columnHelper.display({
        id: 'auto',
        header: () => <span className="text-indigo-600">✨ CEO Email (auto)</span>,
        size: 240,
        cell: (info) => {
          const idx = info.row.index;
          return (
            <div
              className={`flex items-center gap-2 font-mono transition-all duration-500 ${
                idx < autoProgress ? 'text-green-600' : 'text-stone-300'
              }`}
            >
              {idx < autoProgress ? <Check size={14} className="text-green-500" /> : null}
              <span className="truncate">
                {idx < autoProgress ? info.row.original.autoValue : <span className="italic">Empty</span>}
              </span>
            </div>
          );
        },
      }),
      columnHelper.display({
        id: 'user',
        header: () => (
          <form onSubmit={handleUserSubmit} className="relative w-full">
            <input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full pr-8 pl-3 py-2 text-[11px] md:text-xs rounded-lg bg-white/80 border border-stone-200 text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder='Add a column header (e.g. "Industry")'
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-md bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <Play size={12} />
            </button>
          </form>
        ),
        size: 240,
        cell: (info) => {
          const idx = info.row.index;
          return (
            <div
              className={`flex items-center gap-2 font-mono transition-all duration-500 ${
                idx < userProgress ? 'text-indigo-700' : 'text-stone-300'
              }`}
            >
              {idx < userProgress ? <Check size={14} className="text-indigo-500" /> : null}
              <span className="truncate">
                {idx < userProgress ? info.row.original.userValue : <span className="italic">Empty</span>}
              </span>
            </div>
          );
        },
      }),
    ];

    if (isMobile) {
      return baseColumns.filter((col) => col.id !== 'website');
    }
    return baseColumns;
  }, [autoProgress, userProgress, userInput, isMobile]);

  const table = useReactTable({
    data: baseRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      minSize: 120,
      size: 200,
      maxSize: 340,
    },
    columnResizeMode: 'onChange',
  });

  return (
    <section ref={sectionRef} className="py-24 bg-white border-t border-stone-200">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-stone-900 mb-4">See it in action</h2>
          <div className="flex justify-center items-center gap-8 text-stone-600">
            <div className="text-center">
                <p className="font-bold text-stone-900 mb-1">Before</p>
              <p className="text-sm">Blank columns</p>
            </div>
            <div className="text-indigo-400">→</div>
             <div className="text-center">
                <p className="font-bold text-stone-900 mb-1">After</p>
              <p className="text-sm">Auto-fill + your column</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-2xl shadow-indigo-900/10 border border-stone-200 overflow-hidden">
          {/* Mock Toolbar */}
          <div className="bg-stone-50 border-b border-stone-200 px-4 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[640px] md:min-w-[840px] w-full table-fixed text-sm text-stone-700">
              <colgroup>
                {table.getHeaderGroups()[0]?.headers.map((header) => (
                  <col key={header.id} style={{ width: `${header.getSize()}px` }} />
                ))}
              </colgroup>
              <thead className="bg-stone-50 text-[11px] md:text-xs font-semibold text-stone-600 border-b border-stone-200">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="p-2.5 md:p-3 border-r border-stone-200 align-middle last:border-r-0"
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={`${idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/30'} border-b border-stone-100`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="p-2.5 md:p-3 border-r border-stone-100 align-middle last:border-r-0"
                      >
                        <div className="truncate">{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                      </td>
                    ))}
                  </tr>
                ))}
                {[...Array(3)].map((_, i) => (
                  <tr key={`empty-${i}`} className="bg-white opacity-50 border-b border-stone-100">
                    {table.getAllColumns().map((col) => (
                      <td key={`${col.id}-${i}`} className="p-2.5 md:p-3 border-r border-stone-100 last:border-r-0">
                        &nbsp;
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

         <div className="mt-8 text-center text-xs text-stone-500">Type a header and press Find it to fill the second column.</div>

      </div>
    </section>
  );
};

export default LiveDemo;