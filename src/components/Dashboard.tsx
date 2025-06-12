import React from 'react';
import { Clock, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { MonthData } from '../types';

interface DashboardProps {
  data: MonthData;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const chartData = [
    { name: 'Oferecidas', horas: data.horasOferecidas, color: '#3B82F6' },
    { name: 'Utilizadas', horas: data.horasUtilizadas, color: '#EF4444' },
    { name: 'Restantes', horas: data.restante, color: '#10B981' }
  ];

  const pieData = [
    { name: 'Utilizadas', value: data.horasUtilizadas, color: '#EF4444' },
    { name: 'Restantes', value: data.restante, color: '#10B981' }
  ];

  const MetricCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold" style={{ color }}>{value}h</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <Icon size={32} style={{ color }} className="opacity-80" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Horas Oferecidas"
          value={data.horasOferecidas}
          icon={Calendar}
          color="#3B82F6"
          subtitle="Total disponível"
        />
        <MetricCard
          title="Horas Utilizadas"
          value={data.horasUtilizadas}
          icon={Clock}
          color="#EF4444"
          subtitle="Já consumidas"
        />
        <MetricCard
          title="Horas Restantes"
          value={data.restante}
          icon={CheckCircle}
          color="#10B981"
          subtitle="Ainda disponíveis"
        />
        <MetricCard
          title="Total Lançado"
          value={data.totalHorasLancadas}
          icon={TrendingUp}
          color="#F59E0B"
          subtitle="Soma dos registros"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Comparativo de Horas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}h`, 'Horas']} />
              <Bar dataKey="horas" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribuição de Uso</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}h`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}h`, 'Horas']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Info */}
      {data.saldoMesAnterior > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">
            <strong>Saldo do mês anterior:</strong> {data.saldoMesAnterior}h
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;