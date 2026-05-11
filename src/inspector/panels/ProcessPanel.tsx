import { usePortfolioStore } from '../../store/portfolioStore';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { ProcessSectionConfig } from '../../types/portfolio';

export function ProcessPanel({ sectionId }: { sectionId: string }) {
  const { sections, updateSectionConfig } = usePortfolioStore();
  const section = sections.find(s => s.id === sectionId)!;
  const config = section.config as ProcessSectionConfig;

  const steps = config.steps || [];

  const addStep = () => {
    const newStep = { title: 'New Step', description: 'Step description', icon: '' };
    updateSectionConfig(sectionId, { steps: [...steps, newStep] });
  };

  const updateStep = (index: number, updates: Partial<typeof steps[0]>) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], ...updates };
    updateSectionConfig(sectionId, { steps: newSteps });
  };

  const removeStep = (index: number) => {
    updateSectionConfig(sectionId, { steps: steps.filter((_, i) => i !== index) });
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSteps.length) return;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    updateSectionConfig(sectionId, { steps: newSteps });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">
          Process Steps ({steps.length})
        </h3>
        <button
          onClick={addStep}
          className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
        >
          <Plus size={12} />
          Add Step
        </button>
      </div>

      {steps.length === 0 ? (
        <p className="text-white/30 text-sm text-center py-4">
          No steps defined. Add one to outline your process.
        </p>
      ) : (
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-white/5 border border-white/10"
            >
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateStep(index, { title: e.target.value })}
                    placeholder="Step title"
                    className="w-full bg-transparent text-sm font-medium border-b border-white/10 pb-1 outline-none placeholder-white/30 focus:border-white/40"
                  />
                  <textarea
                    value={step.description}
                    onChange={(e) => updateStep(index, { description: e.target.value })}
                    placeholder="Describe this step"
                    rows={2}
                    className="w-full bg-transparent text-xs text-white/60 border-none outline-none resize-none placeholder-white/20"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveStep(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded text-white/30 hover:text-white disabled:opacity-30"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveStep(index, 'down')}
                    disabled={index === steps.length - 1}
                    className="p-1 rounded text-white/30 hover:text-white disabled:opacity-30"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeStep(index)}
                    className="p-1 rounded text-white/40 hover:text-red-400"
                    title="Delete step"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
