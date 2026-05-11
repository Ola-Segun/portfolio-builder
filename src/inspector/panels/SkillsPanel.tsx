import { useState } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { SkillsSectionConfig } from '../../types/portfolio';

export function SkillsPanel({ sectionId }: { sectionId: string }) {
  const { sections, updateSectionConfig } = usePortfolioStore();
  const section = sections.find(s => s.id === sectionId)!;
  const config = section.config as SkillsSectionConfig;

  const categories = config.skills || [];

  const addCategory = () => {
    const newCat = { title: 'New Category', items: [''] };
    updateSectionConfig(sectionId, { skills: [...categories, newCat] });
  };

  const updateCategory = (index: number, updates: Partial<typeof categories[0]>) => {
    const newCats = [...categories];
    newCats[index] = { ...newCats[index], ...updates };
    updateSectionConfig(sectionId, { skills: newCats });
  };

  const removeCategory = (index: number) => {
    updateSectionConfig(sectionId, { skills: categories.filter((_, i) => i !== index) });
  };

  const addSkill = (catIndex: number) => {
    const newCats = [...categories];
    newCats[catIndex].items.push('');
    updateSectionConfig(sectionId, { skills: newCats });
  };

  const updateSkill = (catIndex: number, skillIndex: number, value: string) => {
    const newCats = [...categories];
    newCats[catIndex].items[skillIndex] = value;
    updateSectionConfig(sectionId, { skills: newCats });
  };

  const removeSkill = (catIndex: number, skillIndex: number) => {
    const newCats = [...categories];
    newCats[catIndex].items = newCats[catIndex].items.filter((_, i) => i !== skillIndex);
    updateSectionConfig(sectionId, { skills: newCats });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">
          Skill Categories ({categories.length})
        </h3>
        <button
          onClick={addCategory}
          className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
        >
          <Plus size={12} />
          Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <p className="text-white/30 text-sm text-center py-4">
          No skill categories. Add one to showcase your skills.
        </p>
      ) : (
        <div className="space-y-3">
          {categories.map((cat, catIdx) => (
            <div
              key={catIdx}
              className="p-3 rounded-lg bg-white/5 border border-white/10"
            >
              {/* Category header */}
              <div className="flex items-center gap-2 mb-2">
                <GripVertical size={14} className="text-white/30" />
                <input
                  type="text"
                  value={cat.title}
                  onChange={(e) => updateCategory(catIdx, { title: e.target.value })}
                  placeholder="Category title (e.g. Frontend)"
                  className="flex-1 bg-transparent text-sm font-medium border-none outline-none placeholder-white/30"
                />
                <button
                  onClick={() => removeCategory(catIdx)}
                  className="p-1 rounded text-white/40 hover:text-red-400"
                  title="Delete category"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Skills list */}
              <div className="space-y-1 ml-4">
                {cat.items.map((skill, skillIdx) => (
                  <div key={skillIdx} className="flex items-center gap-1">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => updateSkill(catIdx, skillIdx, e.target.value)}
                      placeholder="Skill name"
                      className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                    />
                    <button
                      onClick={() => removeSkill(catIdx, skillIdx)}
                      className="p-1 rounded text-white/30 hover:text-red-400"
                      title="Remove skill"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addSkill(catIdx)}
                  className="flex items-center gap-1 text-xs text-white/40 hover:text-white py-1"
                >
                  <Plus size={10} /> Add skill
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
