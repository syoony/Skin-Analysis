
import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';
import { AnalysisResult } from '../types';
import { SKIN_TYPE_COLORS, MOCK_PRODUCTS } from '../constants';
import { translations, Language } from '../translations';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
  lang: Language;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, onReset, lang }) => {
  const t = translations[lang];

  const getHealthScore = (metric: string, value: number) => {
    if (metric === t.metrics.hydration) return value;
    // For all other metrics (oiliness, troubles, pigmentation, pores, wrinkles), 
    // a higher raw value from AI means worse condition, so we invert it for a "Health Score".
    return 100 - value;
  };

  const radarData = [
    { subject: t.metrics.hydration, A: getHealthScore(t.metrics.hydration, result.metrics.hydration), fullMark: 100 },
    { subject: t.metrics.oiliness, A: getHealthScore(t.metrics.oiliness, result.metrics.oiliness), fullMark: 100 },
    { subject: t.metrics.troubles, A: getHealthScore(t.metrics.troubles, result.metrics.troubles), fullMark: 100 },
    { subject: t.metrics.pigmentation, A: getHealthScore(t.metrics.pigmentation, result.metrics.pigmentation), fullMark: 100 },
    { subject: t.metrics.pores, A: getHealthScore(t.metrics.pores, result.metrics.pores), fullMark: 100 },
    { subject: t.metrics.wrinkles, A: getHealthScore(t.metrics.wrinkles, result.metrics.wrinkles), fullMark: 100 },
  ];

  const barData = [
    { name: t.metrics.hydration, value: getHealthScore(t.metrics.hydration, result.metrics.hydration) },
    { name: t.metrics.oiliness, value: getHealthScore(t.metrics.oiliness, result.metrics.oiliness) },
    { name: t.metrics.troubles, value: getHealthScore(t.metrics.troubles, result.metrics.troubles) },
    { name: t.metrics.pigmentation, value: getHealthScore(t.metrics.pigmentation, result.metrics.pigmentation) },
    { name: t.metrics.pores, value: getHealthScore(t.metrics.pores, result.metrics.pores) },
    { name: t.metrics.wrinkles, value: getHealthScore(t.metrics.wrinkles, result.metrics.wrinkles) },
  ];

  const getBarColor = (score: number) => {
    if (score >= 80) return '#10b981'; // Green (Excellent)
    if (score >= 50) return '#f59e0b'; // Orange (Fair)
    return '#ef4444'; // Red (Needs Attention)
  };

  const recommendedProducts = MOCK_PRODUCTS.filter(p => 
    p.ingredients.some(ing => result.recommendedIngredients.some(ri => ri.toLowerCase().includes(ing.toLowerCase())))
  ).slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 text-white">
      {/* Summary Card */}
      <section className="bg-[#0c1127] rounded-3xl shadow-sm border border-white/10 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">{t.reportTitle}</h2>
            <p className="text-gray-400">{t.analysisDate} {new Date().toLocaleDateString()}</p>
            <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mt-4 ${SKIN_TYPE_COLORS[result.skinType] || 'bg-white/10 text-white'}`}>
              {t.skinType}: {result.skinType}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="58" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle
                  cx="64" cy="64" r="58" fill="transparent" stroke="#4f46e5" strokeWidth="8"
                  strokeDasharray={364.4} strokeDashoffset={364.4 * (1 - result.overallScore / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold text-white">{result.overallScore}</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{t.scoreLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#0c1127] rounded-3xl shadow-sm border border-white/10 p-6">
          <h3 className="text-lg font-bold text-gray-200 mb-6">{t.healthWebTitle}</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" gridCount={5} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Radar name="Skin Metrics" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0c1127] rounded-3xl shadow-sm border border-white/10 p-6">
          <h3 className="text-lg font-bold text-gray-200 mb-6">{t.detailedMetricsTitle}</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0c1127', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Commentary */}
      <section className="bg-indigo-500/10 rounded-3xl p-8 border border-indigo-500/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-indigo-200">{t.aiInsightTitle}</h3>
            <p className="text-indigo-100/80 leading-relaxed italic">"{result.expertCommentary}"</p>
            <div className="flex flex-wrap gap-2">
              {result.recommendedIngredients.map((ing, i) => (
                <span key={i} className="px-3 py-1 bg-white/5 text-indigo-300 rounded-lg text-sm font-medium border border-white/10 shadow-sm">
                  #{ing}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Routine Recommendations */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#0c1127] rounded-3xl shadow-sm border border-white/10 overflow-hidden">
          <div className="bg-blue-600/80 px-6 py-4 text-white flex items-center gap-3">
            <i className="fa-solid fa-sun text-xl"></i>
            <h3 className="font-bold">{t.morningRoutine}</h3>
          </div>
          <div className="p-6 space-y-4">
            {result.suggestedRoutine.morning.map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold flex items-center justify-center border border-blue-500/20">{i+1}</span>
                <p className="text-gray-300">{step}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#0c1127] rounded-3xl shadow-sm border border-white/10 overflow-hidden">
          <div className="bg-indigo-900/80 px-6 py-4 text-white flex items-center gap-3">
            <i className="fa-solid fa-moon text-xl"></i>
            <h3 className="font-bold">{t.eveningRoutine}</h3>
          </div>
          <div className="p-6 space-y-4">
            {result.suggestedRoutine.evening.map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold flex items-center justify-center border border-indigo-500/20">{i+1}</span>
                <p className="text-gray-300">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-white">{t.bestMatches}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(recommendedProducts.length > 0 ? recommendedProducts : MOCK_PRODUCTS.slice(0, 3)).map((product) => (
            <div key={product.id} className="bg-[#0c1127] rounded-2xl shadow-sm border border-white/10 overflow-hidden group hover:border-indigo-500/50 transition-colors">
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">{product.brand}</p>
                  <span className="bg-indigo-500/10 px-2 py-0.5 rounded text-[10px] font-bold text-indigo-300">
                    {product.category}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-white line-clamp-2 min-h-[3rem]">{product.name}</h4>
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2">{product.matchReason}</p>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {product.ingredients.slice(0, 2).map((ing, i) => (
                    <span key={i} className="text-[10px] bg-white/5 text-gray-400 px-1.5 py-0.5 rounded border border-white/5">
                      {ing}
                    </span>
                  ))}
                </div>
                <button className="w-full py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition mt-4">
                  {t.buyNow}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-center pt-8">
        <button onClick={onReset} className="flex items-center gap-2 text-gray-400 hover:text-indigo-400 font-medium transition">
          <i className="fa-solid fa-rotate-left"></i> {t.newAnalysis}
        </button>
      </div>

      {/* Medical Disclaimer */}
      <footer className="mt-12 text-center text-xs text-gray-500 max-w-2xl mx-auto border-t border-white/10 pt-8">
        <p className="uppercase font-bold mb-2 text-gray-400">{t.disclaimerTitle}</p>
        {t.disclaimerText}
      </footer>
    </div>
  );
};

export default AnalysisDashboard;
