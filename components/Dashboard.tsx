
import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList } from 'recharts';
import { TrendingUp, CreditCard, PiggyBank, ArrowDownRight } from 'lucide-react';

interface DashboardProps {
  income: number;
  fixedExpenses: number;
  installments: number;
  freedMoney: number;
  lang: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ income, fixedExpenses, installments, freedMoney, lang }) => {
  const t = translations[lang];
  const balance = income - (fixedExpenses + installments);

  // Recharts Waterfall Data
  const chartData = [
    { name: t.totalIncome, value: income, fill: '#10b981' },
    { name: t.totalExpenses, value: -fixedExpenses, fill: '#f43f5e' },
    { name: t.totalInstallments, value: -installments, fill: '#f59e0b' },
    { name: t.remainingMoney, value: balance, fill: '#6366f1' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-lg">
          <p className="text-sm font-semibold text-slate-800">{payload[0].payload.name}</p>
          <p className="text-lg font-bold text-indigo-600">€{Math.abs(payload[0].value).toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600">
              <TrendingUp size={20} />
            </div>
          </div>
          <span className="text-slate-500 text-sm font-semibold mb-1 block">{t.totalIncome}</span>
          <div className="text-3xl font-bold text-slate-900">€{income.toLocaleString()}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-rose-50 p-2.5 rounded-xl text-rose-600">
              <CreditCard size={20} />
            </div>
          </div>
          <span className="text-slate-500 text-sm font-semibold mb-1 block">{t.totalExpenses}</span>
          <div className="text-3xl font-bold text-slate-900">€{fixedExpenses.toLocaleString()}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-50 p-2.5 rounded-xl text-amber-600">
              <ArrowDownRight size={20} />
            </div>
          </div>
          <span className="text-slate-500 text-sm font-semibold mb-1 block">{t.totalInstallments}</span>
          <div className="text-3xl font-bold text-slate-900">€{installments.toLocaleString()}</div>
        </div>

        <div className="bg-indigo-600 p-6 rounded-2xl shadow-lg shadow-indigo-100 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-2 -mr-2 text-white/10 group-hover:scale-110 transition-transform duration-500">
            <PiggyBank size={120} />
          </div>
          <div className="relative z-10">
            <div className="bg-white/20 w-fit p-2 rounded-xl mb-4">
              <PiggyBank size={20} />
            </div>
            <span className="text-indigo-100 text-sm font-semibold mb-1 block">{t.freedMoney}</span>
            <div className="text-3xl font-bold">€{freedMoney.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">{t.debtWaterfall}</h3>
              <p className="text-sm text-slate-400 font-medium">Monthly Cash Flow Breakdown</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-bold uppercase block mb-1">{t.remainingMoney}</span>
              <span className={`text-xl font-black ${balance >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>€{balance.toLocaleString()}</span>
            </div>
          </div>

          <div className="h-[300px] w-full min-w-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={50}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                  <LabelList 
                    dataKey="value" 
                    position="top" 
                    formatter={(val: number) => `€${Math.abs(val)}`} 
                    style={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-2xl text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl -mr-16 -mt-16 rounded-full"></div>
          <h4 className="text-lg font-bold mb-4 relative z-10">{lang === Language.PERSIAN ? 'استراتژی بازپرداخت' : 'Repayment Strategy'}</h4>
          <p className="text-slate-400 text-sm leading-relaxed relative z-10 mb-6">
            {lang === Language.PERSIAN 
              ? 'با تمرکز بر بدهی‌های کوچک‌تر، پول آزاد شده را برای تسویه سریع‌تر بدهی‌های بزرگ‌تر استفاده کنید.' 
              : 'By focusing on smaller debts first, use the cumulative freed money to accelerate the payoff of larger creditors.'}
          </p>
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-500">
              <span>Goal Reached</span>
              <span className="text-indigo-400">45%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[45%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
