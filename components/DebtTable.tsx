
import React, { useState } from 'react';
import { Debt, DebtStatus, Language } from '../types';
import { translations } from '../translations';
import { ChevronRight, Filter, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface DebtTableProps {
  debts: Debt[];
  lang: Language;
  onRowClick: (id: string) => void;
}

const DebtTable: React.FC<DebtTableProps> = ({ debts, lang, onRowClick }) => {
  const [filter, setFilter] = useState<DebtStatus | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const t = translations[lang];

  const filteredDebts = debts.filter(d => {
    const matchesFilter = filter === 'All' || d.status === filter;
    const matchesSearch = d.creditor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusStyle = (status: DebtStatus) => {
    switch (status) {
      case DebtStatus.ACTIVE: return 'bg-blue-50 text-blue-600 border-blue-100';
      case DebtStatus.PENDING: return 'bg-amber-50 text-amber-600 border-amber-100';
      case DebtStatus.PAID: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={lang === Language.PERSIAN ? 'جستجوی طلبکار...' : 'Search creditors...'}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full lg:w-auto">
          <Filter size={16} className="text-slate-400 mr-2 flex-shrink-0" />
          {['All', DebtStatus.ACTIVE, DebtStatus.PENDING, DebtStatus.PAID].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s as any)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${filter === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 hover:border-slate-300'}`}
            >
              {s === 'All' ? (lang === Language.PERSIAN ? 'همه' : 'All') : (t as any)[s.toLowerCase() + 'Debts'] || s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
            <tr>
              <th className="px-8 py-4">{t.creditor}</th>
              <th className="px-8 py-4">{t.remainingBalance}</th>
              <th className="px-8 py-4">{t.installment}</th>
              <th className="px-8 py-4">{t.progress}</th>
              <th className="px-8 py-4">{t.status}</th>
              <th className="px-8 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDebts.map(debt => {
              const progress = Math.min(100, ((debt.originalAmount - debt.remainingBalance) / debt.originalAmount) * 100);
              return (
                <motion.tr 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={debt.id} 
                  onClick={() => onRowClick(debt.id)}
                  className="group cursor-pointer hover:bg-slate-50/80 transition-all"
                >
                  <td className="px-8 py-5">
                    <div className="font-bold text-slate-900 text-base">{debt.creditor}</div>
                    <div className="text-xs text-slate-400 font-medium">{debt.category}</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-slate-900 font-bold">€{debt.remainingBalance.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter opacity-70">Total: €{debt.originalAmount.toLocaleString()}</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`text-sm font-black ${debt.monthlyInstallment > 0 ? 'text-indigo-600' : 'text-slate-300'}`}>
                      €{debt.monthlyInstallment}
                    </div>
                  </td>
                  <td className="px-8 py-5 min-w-[160px]">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full ${progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                        />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 w-8">{progress.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${getStatusStyle(debt.status)}`}>
                      {(t as any)[debt.status.toLowerCase() + 'Debts'] || debt.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <ChevronRight className={`text-slate-300 group-hover:text-indigo-500 transition-transform ${lang === Language.PERSIAN ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} size={18} />
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredDebts.length === 0 && (
        <div className="py-20 text-center">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Search size={32} />
          </div>
          <p className="text-slate-400 font-medium">
            {lang === Language.PERSIAN ? 'موردی برای نمایش وجود ندارد.' : 'No items found matching your filters.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default DebtTable;
