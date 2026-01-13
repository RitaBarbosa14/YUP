
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, 
  PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis 
} from 'recharts';
import { 
  LayoutDashboard, MapPin, Users, TrendingUp, PieChart as PieChartIcon, 
  ShoppingBag, ArrowUpRight, Search, FileText
} from 'lucide-react';
import { parseData, aggregateByCity, aggregateBySegment } from './dataService';
// Import CitySummary type to fix the error on line 213
import { CitySummary } from './types';
import KpiCard from './components/KpiCard';

const COLORS = [
  '#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5',
  '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'
];

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const allData = useMemo(() => parseData(), []);
  const citySummaries = useMemo(() => aggregateByCity(allData), [allData]);
  const segmentSummaries = useMemo(() => aggregateBySegment(allData), [allData]);

  const totalRevenue = useMemo(() => allData.reduce((acc, curr) => acc + curr.vlrUltima, 0), [allData]);
  const totalClients = allData.length;
  const globalAvgTicket = useMemo(() => totalRevenue / totalClients, [totalRevenue, totalClients]);
  const avgProfit = useMemo(() => {
    const totalProfit = allData.reduce((acc, curr) => acc + (curr.vlrUltima * curr.profitMargin), 0);
    return (totalProfit / totalRevenue) * 100;
  }, [allData, totalRevenue]);

  const filteredCities = citySummaries.filter(c => 
    c.cidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar - Desktop Only */}
      <aside className="w-full lg:w-64 bg-slate-900 text-white flex flex-col p-6 sticky top-0 h-auto lg:h-screen overflow-y-auto">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-xl italic">
            S
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Sávio Sorvetes</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Dashboard de Vendas</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 bg-orange-500 text-white rounded-lg font-medium transition-all">
            <LayoutDashboard size={20} />
            <span>Visão Geral</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800 rounded-lg font-medium transition-all">
            <MapPin size={20} />
            <span>Cidades</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800 rounded-lg font-medium transition-all">
            <Users size={20} />
            <span>Clientes</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800 rounded-lg font-medium transition-all">
            <PieChartIcon size={20} />
            <span>Segmentos</span>
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <p className="text-[10px] text-slate-500 mb-2">RELATÓRIO DEZEMBRO</p>
          <div className="bg-slate-800 p-3 rounded-lg">
            <p className="text-xs text-slate-300 mb-1">Crescimento vs 2024</p>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold text-sm">+36.1%</span>
              <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[36%]" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 bg-slate-50 overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Dashboard Executivo</h2>
            <p className="text-slate-500">Acompanhamento de performance por Cidade e Segmento</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar cidade..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>
        </header>

        {/* Top KPIs */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard 
            title="Faturamento Total" 
            value={totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            subtitle="Baseado no Valor Última"
            icon={<ShoppingBag className="text-orange-500" />}
          />
          <KpiCard 
            title="Cidades Atendidas" 
            value={citySummaries.length.toString()}
            subtitle={`${totalClients} Clientes Ativos`}
            icon={<MapPin className="text-orange-500" />}
          />
          <KpiCard 
            title="Lucratividade Média" 
            value={`${avgProfit.toFixed(1)}%`}
            subtitle="Estimada por Segmento"
            icon={<TrendingUp className="text-orange-500" />}
            colorClass="text-emerald-600"
          />
          <KpiCard 
            title="Ticket Médio Geral" 
            value={globalAvgTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            subtitle="Valor por Pedido"
            icon={<ArrowUpRight className="text-orange-500" />}
          />
        </section>

        {/* Charts Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue by City Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-[400px]">
            <h4 className="font-bold text-slate-800 mb-6">Faturamento por Cidade (Top 10)</h4>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={citySummaries.slice(0, 10)} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="cidade" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  width={100} 
                  style={{ fontSize: '12px', fontWeight: 500 }}
                />
                <Tooltip 
                  formatter={(val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="totalVendas" fill="#f97316" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Segment Distribution Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-[400px]">
            <h4 className="font-bold text-slate-800 mb-6">Segmentos por Volume de Clientes</h4>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={segmentSummaries.slice(0, 8)}
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="segmento"
                >
                  {segmentSummaries.slice(0, 8).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Profitability vs Ticket Medium Chart */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-slate-800">Análise de Lucratividade vs Ticket Médio por Cidade</h4>
            <span className="text-xs text-slate-400 italic">* Eixo X: Ticket Médio | Eixo Y: Lucratividade | Tamanho: Clientes</span>
          </div>
          <div className="h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="ticketMedio" 
                  name="Ticket Médio" 
                  unit=" R$" 
                  label={{ value: 'Ticket Médio (R$)', position: 'insideBottom', offset: -10 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="lucratividadeMedia" 
                  name="Lucratividade" 
                  unit="%" 
                  label={{ value: 'Lucro (%)', angle: -90, position: 'insideLeft' }}
                />
                <ZAxis type="number" dataKey="totalClientes" range={[100, 1000]} name="Clientes" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as CitySummary;
                      return (
                        <div className="bg-white p-4 shadow-xl rounded-lg border border-slate-100">
                          <p className="font-bold text-slate-800">{data.cidade}</p>
                          <p className="text-sm text-slate-600">Faturamento: {data.totalVendas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                          <p className="text-sm text-slate-600">Ticket Médio: R$ {data.ticketMedio.toFixed(2)}</p>
                          <p className="text-sm font-semibold text-emerald-600">Lucro: {data.lucratividadeMedia.toFixed(1)}%</p>
                          <p className="text-sm text-slate-600">Clientes: {data.totalClientes}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Cidades" data={citySummaries} fill="#f97316" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Detailed Table */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <FileText className="text-slate-400" size={20} />
              <h4 className="font-bold text-slate-800">Resumo Consolidado por Cidade</h4>
            </div>
            <p className="text-xs text-slate-500 font-medium">{filteredCities.length} cidades encontradas</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider font-semibold border-b border-slate-100">
                  <th className="px-6 py-4">Cidade</th>
                  <th className="px-6 py-4 text-center">Clientes</th>
                  <th className="px-6 py-4 text-center">Faturamento</th>
                  <th className="px-6 py-4 text-center">Ticket Médio</th>
                  <th className="px-6 py-4 text-center">Lucratividade</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCities.map((city, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">{city.cidade}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-slate-600">{city.totalClientes}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-slate-900 font-medium">
                        {city.totalVendas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-slate-600">R$ {city.ticketMedio.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`text-sm font-bold ${city.lucratividadeMedia > 25 ? 'text-emerald-600' : 'text-orange-600'}`}>
                          {city.lucratividadeMedia.toFixed(1)}%
                        </span>
                        <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div 
                            className={`h-full ${city.lucratividadeMedia > 25 ? 'bg-emerald-400' : 'bg-orange-400'}`} 
                            style={{ width: `${city.lucratividadeMedia}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        city.totalVendas > 1000 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {city.totalVendas > 1000 ? 'Alta Prod.' : 'Regular'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-400 text-sm">
          <p>© 2025 Sávio Sorvetes - Relatório Analítico de Vendas Mensal</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
