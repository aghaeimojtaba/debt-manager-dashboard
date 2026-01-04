
import React, { useState } from 'react';
import { Debt, DebtStatus, DebtCategory, Language } from '../types';
import { translations } from '../translations';
import { motion } from 'framer-motion';
import { X, Save, ShieldCheck } from 'lucide-react';

interface DebtFormModalProps {
  debt: Debt | null;
  lang: Language;
  onClose: () => void;
  onSubmit: (debt: Debt) => void;
}

const DebtFormModal: React.FC<DebtFormModalProps> = ({ debt, lang, onClose, onSubmit }) => {
  const t = translations[lang];
  const [formData, setFormData] = useState<Partial<Debt>>(debt || {
    creditor: '',
    originalAmount: 0,
    remainingBalance: 0,
    monthlyInstallment: 0,
    // FIX: Using an existing DebtCategory value instead of non-existent BANK_LOW
    category: DebtCategory.CATEGORY_A,
    status: DebtStatus.ACTIVE,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Debt);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden border border-white/20"
      >
        <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <ShieldCheck size={120} />
          </div>
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
          <h3 className="text-2xl font-bold mb-1">{debt ? (lang === Language.PERSIAN ? 'ویرایش بدهی' : 'Edit Debt') : (lang === Language.PERSIAN ? 'افزودن بدهی جدید' : 'New Debt')}</h3>
          <p className="text-indigo-100 text-sm font-medium">{lang === Language.PERSIAN ? 'لطفاً جزئیات را با دقت وارد کنید' : 'Please fill in the creditor details accurately'}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.creditor}</label>
            <input 
              required
              type="text"
              value={formData.creditor}
              onChange={(e) => setFormData({...formData, creditor: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all font-semibold"
              placeholder="e.g. Klarna, Barmer..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.originalAmount}</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">€</span>
                <input 
                  required
                  type="number"
                  value={formData.originalAmount || ''}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFormData({...formData, originalAmount: val, remainingBalance: val});
                  }}
                  className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all font-bold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.installment}</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">€</span>
                <input 
                  required
                  type="number"
                  value={formData.monthlyInstallment || ''}
                  onChange={(e) => setFormData({...formData, monthlyInstallment: Number(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all font-bold text-indigo-600"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.category}</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as DebtCategory})}
                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all font-semibold"
              >
                {Object.values(DebtCategory).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.status}</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as DebtStatus})}
                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all font-semibold"
              >
                {Object.values(DebtStatus).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <Save size={20} />
            {lang === Language.PERSIAN ? 'ذخیره بدهی' : 'Save Debt Entry'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default DebtFormModal;
