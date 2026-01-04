
import React from 'react';
import { Debt, DebtStatus, Language } from '../types';
import { translations } from '../translations';
import { motion } from 'framer-motion';
import { X, CheckCircle, Edit2, Trash2, Calendar, History, TrendingDown } from 'lucide-react';

interface DebtDrawerProps {
  debt: Debt;
  lang: Language;
  onClose: () => void;
  onSettle: (id: string) => void;
  onEdit: (debt: Debt) => void;
  onDelete: (id: string) => void;
}

const DebtDrawer: React.FC<DebtDrawerProps> = ({ debt, lang, onClose, onSettle, onEdit, onDelete }) => {
  const t = translations[lang];
  const progress = debt.originalAmount > 0 ? ((debt.originalAmount - debt.remainingBalance) / debt.originalAmount) * 100 : 0;
  const monthsRemaining = debt.monthlyInstallment > 0 
    ? Math.ceil(debt.remainingBalance / debt.monthlyInstallment) 
    : 0;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
      />
      
      <motion.div 
        initial={{ x: lang === Language.PERSIAN ? '-100%' : '100%' }}
        animate={{ x: 0 }}
        exit={{ x: lang === Language.PERSIAN ? '-100%' : '100%' }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`fixed top-0 bottom-0 ${lang === Language.PERSIAN ? 'left-0' : 'right-0'} w-full max-w-md bg-white shadow-2xl z-[60] flex flex-col`}
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">{debt.creditor}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" fill="transparent" stroke="#f1f5f9" strokeWidth="10" />
                <motion.circle
                  cx="80" cy="80" r="70" fill="transparent"
                  stroke={debt.status === DebtStatus.PAID ? "#10b981" : "#6366f1"}
                  strokeWidth="10"
                  strokeDasharray={440}
                  initial={{ strokeDashoffset: 440 }}
                  animate={{ strokeDashoffset: 440 - (440 * progress) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800">{progress.toFixed(0)}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.paidPercentage}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">{t.remainingBalance}</span>
              <span className="text-xl font-black text-slate-800">€{debt.remainingBalance.toLocaleString()}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">{t.installment}</span>
              <span className="text-xl font-black text-indigo-600">€{debt.monthlyInstallment}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={14} /> Analysis
            </h4>
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center gap-4">
              <div className="bg-white p-2 rounded-xl text-indigo-500 shadow-sm">
                <TrendingDown size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-indigo-900">
                  {monthsRemaining} {t.monthsLeft}
                </p>
                <p className="text-xs text-indigo-600/70">Estimated payoff timeline based on installments.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <History size={14} /> {lang === Language.PERSIAN ? 'تاریخچه پرداخت‌ها' : 'Payment History'}
            </h4>
            <div className="text-center py-6 text-slate-400 italic text-sm">
              No recent payments recorded.
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 grid grid-cols-2 gap-3">
          {debt.status !== DebtStatus.PAID && (
            <button 
              onClick={() => onSettle(debt.id)}
              className="col-span-2 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl transition shadow-lg shadow-emerald-100 mb-2"
            >
              <CheckCircle size={20} />
              {t.settle}
            </button>
          )}
          <button 
            onClick={() => onEdit(debt)}
            className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition"
          >
            <Edit2 size={18} />
            {lang === Language.PERSIAN ? 'ویرایش' : 'Edit'}
          </button>
          <button 
            onClick={() => onDelete(debt.id)}
            className="flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-3 rounded-xl transition"
          >
            <Trash2 size={18} />
            {lang === Language.PERSIAN ? 'حذف' : 'Delete'}
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default DebtDrawer;
