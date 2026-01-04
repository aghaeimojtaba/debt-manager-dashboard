
import React, { useState, useEffect, useMemo, startTransition } from 'react';
import { 
  Language, 
  Debt, 
  DebtStatus, 
  DebtCategory, 
  FixedExpense,
  UserProfile
} from './types';
import { translations } from './translations';
import Dashboard from './components/Dashboard';
import DebtTable from './components/DebtTable';
import DebtDrawer from './components/DebtDrawer';
import DebtFormModal from './components/DebtFormModal';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Wallet, Receipt, Edit3, Trash2, Save, CreditCard, Share2 } from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.GERMAN);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [income, setIncome] = useState<UserProfile>({ mainSalary: 0, miniJob: 0 });
  const [selectedDebtId, setSelectedDebtId] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<FixedExpense | null>(null);

  useEffect(() => {
    // Initial Debt Data - 17 Anonymized items
    const initialDebts: Debt[] = Array.from({ length: 17 }, (_, i) => ({
      id: (i + 1).toString(),
      creditor: `Debt Item ${i + 1}`,
      originalAmount: 0,
      remainingBalance: 0,
      monthlyInstallment: 0,
      category: i < 4 ? DebtCategory.CATEGORY_A : i < 8 ? DebtCategory.CATEGORY_B : i < 12 ? DebtCategory.CATEGORY_C : DebtCategory.CATEGORY_D,
      status: i < 10 ? DebtStatus.ACTIVE : DebtStatus.PENDING
    }));

    // Initial Fixed Expense Data - 8 Anonymized items
    const initialFixed: FixedExpense[] = Array.from({ length: 8 }, (_, i) => ({
      id: `f${i + 1}`,
      name: `Fixed Expense ${i + 1}`,
      nameFa: `هزینه ثابت ${i + 1}`,
      nameDe: `Fixkosten ${i + 1}`,
      amount: 0
    }));

    setDebts(initialDebts);
    setFixedExpenses(initialFixed);
  }, []);

  const t = translations[lang];

  // Logic Calculations
  const totalIncome = income.mainSalary + income.miniJob;
  const totalFixedExpenses = fixedExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const activeDebts = debts.filter(d => d.status === DebtStatus.ACTIVE);
  const totalInstallments = activeDebts.reduce((acc, curr) => acc + curr.monthlyInstallment, 0);
  const freedMoney = debts.filter(d => d.status === DebtStatus.PAID).reduce((acc, curr) => acc + curr.monthlyInstallment, 0);

  const selectedDebt = useMemo(() => debts.find(d => d.id === selectedDebtId) || null, [selectedDebtId, debts]);

  // Handlers
  const toggleLang = (l: Language) => startTransition(() => setLang(l));

  const openEditModal = (debt: Debt) => {
    setEditingDebt(debt);
    setIsFormModalOpen(true);
    setSelectedDebtId(null);
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExpense) {
      if (editingExpense.id) {
        setFixedExpenses(prev => prev.map(exp => exp.id === editingExpense.id ? editingExpense : exp));
      } else {
        setFixedExpenses(prev => [...prev, { ...editingExpense, id: Date.now().toString() }]);
      }
    }
    setIsExpenseModalOpen(false);
    setEditingExpense(null);
  };

  const deleteExpense = (id: string) => setFixedExpenses(prev => prev.filter(e => e.id !== id));

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-300 ${lang === Language.PERSIAN ? 'rtl font-vazir' : 'ltr font-inter'}`} dir={lang === Language.PERSIAN ? 'rtl' : 'ltr'}>
      <header className="glass sticky top-0 z-40 border-b border-slate-200/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-indigo-200 shadow-lg">
              <Wallet size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t.dashboard}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button onClick={() => toggleLang(Language.GERMAN)} className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${lang === Language.GERMAN ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>DE</button>
              <button onClick={() => toggleLang(Language.PERSIAN)} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${lang === Language.PERSIAN ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>FA</button>
            </div>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Share2 size={20} />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        <Dashboard income={totalIncome} fixedExpenses={totalFixedExpenses} installments={totalInstallments} freedMoney={freedMoney} lang={lang} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Income Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CreditCard className="text-indigo-500" size={20} />
              {t.incomeBreakdown}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <span className="text-sm font-semibold text-slate-600">{t.mainSalary}</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={income.mainSalary || ''} 
                    onChange={(e) => setIncome({...income, mainSalary: Number(e.target.value)})}
                    className="w-24 bg-white border border-slate-200 rounded-lg px-2 py-1 text-right font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-none" 
                  />
                  <span className="font-bold text-slate-400">€</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <span className="text-sm font-semibold text-slate-600">{t.miniJob}</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={income.miniJob || ''} 
                    onChange={(e) => setIncome({...income, miniJob: Number(e.target.value)})}
                    className="w-24 bg-white border border-slate-200 rounded-lg px-2 py-1 text-right font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-none" 
                  />
                  <span className="font-bold text-slate-400">€</span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center px-4">
                <span className="font-bold text-slate-900">{t.totalIncome}</span>
                <span className="text-xl font-black text-emerald-600">€{totalIncome.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Itemized Fixed Expenses Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Receipt className="text-indigo-500" size={20} />
                {t.fixedExpenses}
              </h3>
              <button 
                onClick={() => { setEditingExpense({id: '', name: '', nameFa: '', nameDe: '', amount: 0}); setIsExpenseModalOpen(true); }}
                className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-slate-800 transition-colors"
              >
                + {t.addExpense}
              </button>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-50">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400">
                  <tr>
                    <th className="px-4 py-3 text-left">{t.expenseName}</th>
                    <th className="px-4 py-3 text-right">{t.amount}</th>
                    <th className="px-4 py-3 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {fixedExpenses.map(exp => (
                    <tr key={exp.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-semibold text-slate-700">
                        {lang === Language.PERSIAN ? exp.nameFa : exp.nameDe}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-900">€{exp.amount}</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button onClick={() => { setEditingExpense(exp); setIsExpenseModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-indigo-500"><Edit3 size={14}/></button>
                        <button onClick={() => deleteExpense(exp.id)} className="p-1.5 text-slate-400 hover:text-rose-500"><Trash2 size={14}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest">{t.totalExpenses}</span>
                <span className="text-lg font-black">€{totalFixedExpenses.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Receipt className="text-indigo-500" />
            {t.activeDebts}
          </h2>
          <motion.button onClick={() => { setEditingDebt(null); setIsFormModalOpen(true); }} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md">+ Add Debt</motion.button>
        </div>

        <DebtTable debts={debts} lang={lang} onRowClick={(id) => setSelectedDebtId(id)} />
      </main>

      <AnimatePresence>
        {selectedDebt && <DebtDrawer debt={selectedDebt} lang={lang} onClose={() => setSelectedDebtId(null)} onSettle={(id) => setDebts(prev => prev.map(d => d.id === id ? {...d, status: DebtStatus.PAID, remainingBalance: 0} : d))} onEdit={openEditModal} onDelete={(id) => setDebts(prev => prev.filter(d => d.id !== id))} />}
        {isFormModalOpen && <DebtFormModal debt={editingDebt} lang={lang} onClose={() => setIsFormModalOpen(false)} onSubmit={(debt) => { if (editingDebt) setDebts(prev => prev.map(d => d.id === debt.id ? debt : d)); else setDebts(prev => [...prev, {...debt, id: Date.now().toString()}]); setIsFormModalOpen(false); }} />}
        
        {isExpenseModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsExpenseModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white w-full max-w-md rounded-2xl p-6 relative z-10">
              <h3 className="text-xl font-bold mb-4">{t.addExpense}</h3>
              <form onSubmit={handleExpenseSubmit} className="space-y-4">
                <input required placeholder="Name (EN)" value={editingExpense?.name} onChange={e => setEditingExpense({...editingExpense!, name: e.target.value})} className="w-full border p-2 rounded-lg" />
                <input required placeholder="نام (Persian)" value={editingExpense?.nameFa} onChange={e => setEditingExpense({...editingExpense!, nameFa: e.target.value})} className="w-full border p-2 rounded-lg text-right" />
                <input required placeholder="Name (German)" value={editingExpense?.nameDe} onChange={e => setEditingExpense({...editingExpense!, nameDe: e.target.value})} className="w-full border p-2 rounded-lg" />
                <input required type="number" placeholder="Amount" value={editingExpense?.amount || ''} onChange={e => setEditingExpense({...editingExpense!, amount: Number(e.target.value)})} className="w-full border p-2 rounded-lg" />
                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"><Save size={18}/> {t.save}</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
