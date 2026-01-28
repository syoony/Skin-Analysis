
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

  const radarData = [
    { subject: t.metrics.hydration, A: result.metrics.hydration, fullMark: 100 },
    { subject: t.metrics.oiliness, A: 100 - result.metrics.oiliness, fullMark: 100 },
    { subject: t.metrics.troubles, A: 100 - result.metrics.troubles, fullMark: 100 },
    { subject: t.metrics.pigmentation, A: 100 - result.metrics.pigmentation, fullMark: 100 },
    { subject: t.metrics.pores, A: 100 - result.metrics.pores, fullMark: 100 },
    { subject: t.metrics.wrinkles, A: 100 - result.metrics.wrinkles, fullMark: 100 },
  ];

  const barData = [
    { name: t.metrics.hydration, value: result.metrics.hydration },
    { name: t.metrics.oiliness, value: result.metrics.oiliness },
    { name: t.metrics.troubles, value: result.metrics.troubles },
    { name: t.metrics.pigmentation, value: result.metrics.pigmentation },
    { name: t.metrics.pores, value: result.metrics.pores },
    { name: t.metrics.wrinkles, value: result.metrics.wrinkles },
  ];

  const recommendedProducts = MOCK_PRODUCTS.filter(p => 
    p.ingredients.some(ing => result.recommendedIngredients.some(ri => ri.toLowerCase().includes(ing.toLowerCase())))
  ).slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Summary Card */}
      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">{t.reportTitle}</h2>
            <p className="text-gray-500">{t.analysisDate} {new Date().toLocaleDateString()}</p>
            <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mt-4 ${SKIN_TYPE_COLORS[result.skinType] || 'bg-gray-100 text-gray-700'}`}>
              {t.skinType}: {result.skinType}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="58" fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
                <circle
                  cx="64" cy="64" r="58" fill="transparent" stroke="#4f46e5" strokeWidth="8"
                  strokeDasharray={364.4} strokeDashoffset={364.4 * (1 - result.overallScore / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold text-gray-900">{result.overallScore}</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{t.scoreLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">{t.healthWebTitle}</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <Radar name="Skin Metrics" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">{t.detailedMetricsTitle}</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value > 70 ? '#ef4444' : entry.value > 40 ? '#f59e0b' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Commentary */}
      <section className="bg-indigo-50 rounded-3xl p-8 border border-indigo-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-indigo-900">{t.aiInsightTitle}</h3>
            <p className="text-indigo-800/80 leading-relaxed italic">"{result.expertCommentary}"</p>
            <div className="flex flex-wrap gap-2">
              {result.recommendedIngredients.map((ing, i) => (
                <span key={i} className="px-3 py-1 bg-white text-indigo-600 rounded-lg text-sm font-medium border border-indigo-200 shadow-sm">
                  #{ing}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Routine Recommendations */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-blue-600 px-6 py-4 text-white flex items-center gap-3">
            <i className="fa-solid fa-sun text-xl"></i>
            <h3 className="font-bold">{t.morningRoutine}</h3>
          </div>
          <div className="p-6 space-y-4">
            {result.suggestedRoutine.morning.map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center border border-blue-100">{i+1}</span>
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-indigo-900 px-6 py-4 text-white flex items-center gap-3">
            <i className="fa-solid fa-moon text-xl"></i>
            <h3 className="font-bold">{t.eveningRoutine}</h3>
          </div>
          <div className="p-6 space-y-4">
            {result.suggestedRoutine.evening.map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center border border-indigo-100">{i+1}</span>
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900">{t.bestMatches}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(recommendedProducts.length > 0 ? recommendedProducts : MOCK_PRODUCTS.slice(0, 3)).map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
              <div className="h-48 overflow-hidden bg-gray-50 relative">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-indigo-600 shadow-sm border border-indigo-50">
                  {product.category}
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <p className="text-xs text-indigo-500 font-bold uppercase tracking-wider">{product.brand}</p>
                  <h4 className="font-bold text-gray-900 line-clamp-1">{product.name}</h4>
                </div>
                <button className="w-full py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition">
                  {t.buyNow}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-center pt-8">
        <button onClick={onReset} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium transition">
          <i className="fa-solid fa-rotate-left"></i> {t.newAnalysis}
        </button>
      </div>

      {/* Medical Disclaimer */}
      <footer className="mt-12 text-center text-xs text-gray-400 max-w-2xl mx-auto border-t border-gray-200 pt-8">
        <p className="uppercase font-bold mb-2">{t.disclaimerTitle}</p>
        {t.disclaimerText}
      </footer>
    </div>
  );
};

export default AnalysisDashboard;
