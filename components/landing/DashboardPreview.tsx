import {
  Activity,
  AlertCircle,
  Bot,
  Building,
  Building2,
  Camera,
  Clock,
  FileText,
  Home,
  PhoneCall,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import { useMemo } from 'react';

export default function DashboardPreview() {
  const waveformHeights = useMemo(
    () =>
      [1, 2, 3, 4, 5, 6, 7, 8].map((i) => Math.max(20, (i * 12.5 + 30) % 100)),
    [],
  );

  return (
    <div className="w-[1022px] h-[575px] rounded-2xl border border-gray-200 bg-white overflow-hidden flex shadow-2xl relative text-gray-900 font-sans [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 bg-gray-50 p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-gray-900">RentIq</span>
        </div>

        <nav className="flex flex-col gap-1">
          {[
            { icon: Home, label: 'Overview', active: true },
            { icon: Building, label: 'Properties' },
            { icon: Home, label: 'Units' },
            { icon: Wrench, label: 'Maintenance' },
            { icon: Bot, label: 'AI Agents' },
            { icon: FileText, label: 'Documents' },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                item.active
                  ? 'bg-gray-200 text-gray-900 font-medium'
                  : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
          <h1 className="text-lg font-medium text-gray-900">Overview</h1>
          <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            <Sparkles size={16} />
            Ask Sara AI
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
          {/* Metrics Row */}
          <div className="grid grid-cols-4 gap-4">
            {/* Metric 1 */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-medium uppercase tracking-wider">
                  Total Monthly Rent
                </span>
                <TrendingUp size={14} className="text-gray-400" />
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                ₹4,25,000
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <span className="text-gray-900 font-medium">+12%</span> vs last
                month
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-medium uppercase tracking-wider">
                  Active Maintenance
                </span>
                <Wrench size={14} className="text-gray-400" />
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                12 Open
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <AlertCircle size={12} className="text-gray-400" />
                <span className="text-gray-600">3 Critical</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-medium uppercase tracking-wider">
                  AI Efficiency
                </span>
                <Clock size={14} className="text-gray-400" />
              </div>
              <div className="text-2xl font-semibold text-gray-900">42 hrs</div>
              <div className="text-xs text-gray-500">
                saved by automated collection
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-medium uppercase tracking-wider">
                  Vacancy Cost
                </span>
                <TrendingDown size={14} className="text-gray-400" />
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                ₹31,000
              </div>
              <div className="text-xs text-gray-500">lost this month</div>
            </div>
          </div>

          {/* Chart Area */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col gap-4 flex-1 min-h-[180px]">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-900">
                Predictive Rent & Occupancy
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-800" /> Rent
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-300" /> Occupancy
                </div>
              </div>
            </div>
            {/* Mock Chart */}
            <div className="flex-1 relative w-full flex items-end gap-2">
              {/* Smooth gradient area chart mock */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-200/50 to-transparent rounded-lg" />
              <svg
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
              >
                <path
                  d="M0,100 L0,60 Q25,40 50,50 T100,30 L100,100 Z"
                  fill="rgba(0,0,0,0.05)"
                />
                <path
                  d="M0,60 Q25,40 50,50 T100,30"
                  fill="none"
                  stroke="rgba(0,0,0,0.8)"
                  strokeWidth="2"
                />

                <path
                  d="M0,100 L0,80 Q25,70 50,85 T100,60 L100,100 Z"
                  fill="rgba(0,0,0,0.02)"
                />
                <path
                  d="M0,80 Q25,70 50,85 T100,60"
                  fill="none"
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              </svg>
            </div>
          </div>

          {/* Live AI Activity Feed */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
            <h2 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Activity size={16} className="text-gray-500" />
              Live AI Activity Feed
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-gray-200">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <PhoneCall size={14} className="text-gray-600" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">Sara AI</span>{' '}
                    is calling Tenant in Flat A101 regarding overdue rent
                  </div>
                  <div className="text-xs text-gray-500">
                    Just now • Voice Agent
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-gray-200">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Camera size={14} className="text-gray-600" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">
                      Maintenance Agent
                    </span>{' '}
                    analyzed photo of burst pipe:{' '}
                    <span className="text-gray-900 font-medium">
                      Severity High
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    2 mins ago • Vision AI
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI Agent Widget */}
      <div className="absolute bottom-6 right-6 bg-white border border-gray-200 rounded-2xl p-4 shadow-xl flex items-center gap-4 backdrop-blur-xl">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center z-10 relative">
            <Bot size={20} className="text-white" />
          </div>
          <div className="absolute inset-0 rounded-full bg-black/10 animate-ping" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium text-gray-900">
            Sara AI is active
          </div>
          <div className="flex items-center gap-1 h-3">
            {/* Waveform */}
            {waveformHeights.map((height, i) => (
              <div
                key={i}
                className="w-1 bg-gray-400 rounded-full animate-pulse"
                style={{
                  height: `${height}%`,
                  animationDelay: `${(i + 1) * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
