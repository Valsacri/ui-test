import { Users, TrendingUp, Target } from 'lucide-react';

interface ExpectedImpactData {
  preEventReach: number;
  duringEventReach: number;
  postEventReach: number;
  expectedAttendance: number;
  maxCapacity?: number;
}

interface ExpectedImpactSidebarProps {
  data: ExpectedImpactData;
}

export function ExpectedImpactSidebar({ data }: ExpectedImpactSidebarProps) {
  const totalReach = data.preEventReach + data.duringEventReach + data.postEventReach;
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-1">Expected Impact</h3>
        <p className="text-sm text-gray-500">Live metrics based on your inputs</p>
      </div>

      {/* Pre-Event Phase */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
        <div className="mb-3">
          <span className="text-sm font-semibold text-blue-900">Pre-Event</span>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-blue-700">Reach</span>
              <span className="text-lg font-bold text-blue-900">{formatNumber(data.preEventReach)}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-blue-700">Engagements (5%)</span>
              <span className="text-lg font-bold text-blue-900">{formatNumber(Math.round(data.preEventReach * 0.05))}</span>
            </div>
          </div>
        </div>
      </div>

      {/* During Event Phase */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-100">
        <div className="mb-3">
          <span className="text-sm font-semibold text-[#FC8936]">During Event</span>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-orange-700">Reach</span>
              <span className="text-lg font-bold text-[#FC8936]">{formatNumber(data.duringEventReach)}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-orange-700">Engagements (5%)</span>
              <span className="text-lg font-bold text-[#FC8936]">{formatNumber(Math.round(data.duringEventReach * 0.05))}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Post-Event Phase */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
        <div className="mb-3">
          <span className="text-sm font-semibold text-purple-600">Post-Event</span>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-purple-700">Reach</span>
              <span className="text-lg font-bold text-purple-600">{formatNumber(data.postEventReach)}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-purple-700">Engagements (5%)</span>
              <span className="text-lg font-bold text-purple-600">{formatNumber(Math.round(data.postEventReach * 0.05))}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Totals Section */}
      <div className="border-t-2 border-gray-200 pt-4">
        <div className="bg-white rounded-lg p-4 border-2 border-[#003C66] shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#003C66]" />
            <span className="text-sm font-semibold text-[#003C66]">Campaign Totals</span>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Total Reach</span>
                <span className="text-2xl font-bold text-[#003C66]">{formatNumber(totalReach)}</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Total Engagements</span>
                <span className="text-2xl font-bold text-[#003C66]">{formatNumber(Math.round(totalReach * 0.05))}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expected Attendance */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-green-900">Expected Attendance</span>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold text-green-900">{data.expectedAttendance}</div>
            {data.maxCapacity && (
              <div className="text-sm text-green-700">/ {data.maxCapacity}</div>
            )}
          </div>
          {data.maxCapacity && (
            <div className="mt-2">
              <div className="w-full bg-green-200 rounded-full h-1.5">
                <div 
                  className="bg-green-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((data.expectedAttendance / data.maxCapacity) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-green-700 mt-1">
                {Math.round((data.expectedAttendance / data.maxCapacity) * 100)}% capacity
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}