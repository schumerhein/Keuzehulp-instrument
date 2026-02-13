
import React, { useState, useCallback, useEffect } from 'react';
import Step from './components/Step';
import Results from './components/Results';
import { ICONS, COLORS } from './constants';
import { UserConfig, ConfigResult, InstrumentType, SkillLevel, Space, Budget, Condition, Priority } from './types';
import { getPianoRecommendations } from './services/geminiService';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [results, setResults] = useState<ConfigResult | null>(null);
  const [config, setConfig] = useState<UserConfig>({
    instrumentType: 'acoustic', // First option selected by default
    skillLevel: 'beginner',      // First option selected by default
    space: 'small',              // First option selected by default
    budget: '1-3k',              // First option selected by default
    condition: 'new',            // First option selected by default
    priorities: ['warm_sound'],  // First priority selected by default
  });

  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinish = async () => {
    setCurrentStep(totalSteps);
    setIsFinishing(true);
    try {
      const data = await getPianoRecommendations(config);
      setResults(data);
    } catch (e) {
      console.error("Fout bij ophalen advies", e);
    } finally {
      setIsFinishing(false);
    }
  };

  const updateConfig = <K extends keyof UserConfig>(key: K, value: UserConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const togglePriority = (id: Priority) => {
    setConfig(prev => {
      const exists = prev.priorities.includes(id);
      if (exists) {
        return { ...prev, priorities: prev.priorities.filter(p => p !== id) };
      }
      if (prev.priorities.length >= 3) return prev;
      return { ...prev, priorities: [...prev.priorities, id] };
    });
  };

  const reset = () => {
    setCurrentStep(0);
    setResults(null);
    setConfig({
      instrumentType: 'acoustic',
      skillLevel: 'beginner',
      space: 'small',
      budget: '1-3k',
      condition: 'new',
      priorities: ['warm_sound'],
    });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.light }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-serif tracking-widest uppercase text-schumer-dark">Schumer</span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-schumer-red -mt-1 font-bold">Piano's & Vleugels</span>
          </div>
          {currentStep < totalSteps && (
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400 font-medium">
              Stap {currentStep + 1} van {totalSteps}
            </div>
          )}
        </div>
      </header>

      {/* Progress Bar */}
      {currentStep < totalSteps && (
        <div className="w-full h-1 bg-gray-200">
          <div 
            className="h-full bg-schumer-red transition-all duration-500 ease-out" 
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl">
          {currentStep === 0 && (
            <Step
              question="Wat zoekt u precies?"
              subtitle="Beantwoord 4 vragen en kom erachter welk instrument bij u past"
              options={[
                { id: 'acoustic', label: 'Akoestische piano', icon: <ICONS.AcousticPiano /> },
                { id: 'vleugel', label: 'Vleugel', icon: <ICONS.GrandPiano /> },
                { id: 'digital', label: 'Digitale piano', icon: <ICONS.Digital /> },
                { id: 'unsure', label: 'Ik twijfel nog', icon: <ICONS.Question /> },
              ]}
              selectedId={config.instrumentType}
              onSelect={(id) => { updateConfig('instrumentType', id as InstrumentType); handleNext(); }}
            />
          )}

          {currentStep === 1 && (
            <Step
              question="Wat is uw speelniveau?"
              options={[
                { id: 'beginner', label: 'Beginner', icon: <ICONS.SkillBeginner /> },
                { id: 'intermediate', label: 'Gevorderd', icon: <ICONS.SkillIntermediate /> },
                { id: 'advanced', label: 'Vergevorderd / Conservatorium', icon: <ICONS.SkillAdvanced /> },
                { id: 'professional', label: 'Professioneel', icon: <ICONS.SkillProfessional /> },
              ]}
              selectedId={config.skillLevel}
              onSelect={(id) => { updateConfig('skillLevel', id as SkillLevel); handleNext(); }}
            />
          )}

          {currentStep === 2 && (
            <Step
              question="Waar komt het instrument te staan?"
              options={[
                { id: 'small', label: 'Klein appartement', icon: <ICONS.SpaceSmall /> },
                { id: 'medium', label: 'Gemiddelde woonkamer', icon: <ICONS.SpaceMedium /> },
                { id: 'large', label: 'Grote woonkamer / muziekkamer', icon: <ICONS.SpaceLarge /> },
                { id: 'unsure', label: 'Weet ik nog niet', icon: <ICONS.Question /> },
              ]}
              selectedId={config.space}
              onSelect={(id) => { updateConfig('space', id as Space); handleNext(); }}
            />
          )}

          {currentStep === 3 && (
            <Step
              question="Wat is uw budgetindicatie?"
              options={[
                { id: '1-3k', label: '€1.000 – €3.000', icon: <ICONS.Money1 /> },
                { id: '3-7.5k', label: '€3.000 – €7.500', icon: <ICONS.Money2 /> },
                { id: '7.5-15k', label: '€7.500 – €15.000', icon: <ICONS.Money3 /> },
                { id: '15k+', label: '€15.000+', icon: <ICONS.Money4 /> },
              ]}
              selectedId={config.budget}
              onSelect={(id) => { updateConfig('budget', id as Budget); handleNext(); }}
            />
          )}

          {currentStep === 4 && (
            <Step
              question="Wat heeft uw voorkeur?"
              options={[
                { id: 'new', label: 'Nieuw', icon: <ICONS.ConditionNew /> },
                { id: 'used', label: 'Tweedehands / gereviseerd', icon: <ICONS.ConditionUsed /> },
                { id: 'any', label: 'Maakt niet uit', icon: <ICONS.Sparkle /> },
              ]}
              selectedId={config.condition}
              onSelect={(id) => { updateConfig('condition', id as Condition); handleNext(); }}
            />
          )}

          {currentStep === 5 && (
            <div className="flex flex-col">
              <Step
                question="Wat is belangrijk voor u? (Kies max. 3)"
                options={[
                  { id: 'warm_sound', label: 'Warme klank', icon: <ICONS.Warm /> },
                  { id: 'bright_sound', label: 'Heldere klank', icon: <ICONS.Bright /> },
                  { id: 'design', label: 'Design & uitstraling', icon: <ICONS.Design /> },
                  { id: 'compact', label: 'Compact formaat', icon: <ICONS.Compact /> },
                  { id: 'value', label: 'Waardebehoud', icon: <ICONS.Value /> },
                  { id: 'silent', label: 'Stil oefenen (Silent)', icon: <ICONS.Silent /> },
                  { id: 'top_brand', label: 'Topmerk', icon: <ICONS.TopBrand /> },
                ]}
                selectedId={config.priorities}
                onSelect={(id) => togglePriority(id as Priority)}
                multiSelect
              />
              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleFinish}
                  disabled={config.priorities.length === 0}
                  className={`
                    px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300
                    ${config.priorities.length > 0 
                      ? 'bg-schumer-dark text-white shadow-xl hover:-translate-y-1 hover:bg-black' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                  `}
                >
                  Toon mijn advies
                </button>
              </div>
            </div>
          )}

          {currentStep === totalSteps && (
            <Results 
              results={results} 
              onReset={reset} 
              isLoading={isFinishing} 
            />
          )}

          {/* Navigation */}
          {currentStep > 0 && currentStep < totalSteps && (
            <div className="mt-8 flex justify-center">
              <button 
                onClick={handleBack}
                className="text-gray-400 hover:text-schumer-red font-medium flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Terug naar vorige vraag
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer / USPs */}
      <footer className="py-10 px-4 border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center group">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-schumer-red/5 text-schumer-red mb-3 transition-colors group-hover:bg-schumer-red group-hover:text-white">
                <ICONS.Specialist />
              </div>
              <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-1">Dé specialist</h4>
              <p className="text-gray-500 text-xs">Sinds 1921 dé piano-specialist van Nederland.</p>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-schumer-red/5 text-schumer-red mb-3 transition-colors group-hover:bg-schumer-red group-hover:text-white">
                <ICONS.Workshop />
              </div>
              <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-1">Eigen werkplaats</h4>
              <p className="text-gray-500 text-xs">Vakkundig onderhoud door eigen pianotechnici.</p>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-schumer-red/5 text-schumer-red mb-3 transition-colors group-hover:bg-schumer-red group-hover:text-white">
                <ICONS.Advice />
              </div>
              <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-1">Eerlijk advies</h4>
              <p className="text-gray-500 text-xs">Persoonlijk en eerlijk advies in onze showroom.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
