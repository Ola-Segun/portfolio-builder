import { useState, useCallback, useRef } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { WorkSectionConfig } from '../../types/portfolio';

// ── ProjectCard — isolated local state so typing doesn't hit the store ────────
// Each card owns its own draft; only flushes to store on blur or Enter
interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  tags: string[];
}

function ProjectCard({
  project,
  index,
  total,
  onUpdate,
  onRemove,
  onMove,
}: {
  project: Project;
  index: number;
  total: number;
  onUpdate: (updates: Partial<Project>) => void;
  onRemove: () => void;
  onMove: (dir: 'up' | 'down') => void;
}) {
  // Local draft state — UI is instant, store only updates on blur
  const [draft, setDraft] = useState(project);
  const prevIdRef = useRef(project.id);

  // Reset draft if the project identity changed (e.g. undo/redo)
  if (project.id !== prevIdRef.current) {
    prevIdRef.current = project.id;
    // Can't call setState here, but the parent re-mounts via key={project.id}
  }

  const field = (key: keyof Project) => ({
    value: String(draft[key] ?? ''),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDraft(d => ({ ...d, [key]: e.target.value }));
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = e.target.value;
      if (key === 'tags') {
        const tags = val.split(',').map(t => t.trim()).filter(Boolean);
        if (JSON.stringify(tags) !== JSON.stringify(project.tags)) onUpdate({ tags });
      } else {
        if (val !== String(project[key] ?? '')) onUpdate({ [key]: val });
      }
    },
  });

  const tagsDisplay = Array.isArray(draft.tags) ? draft.tags.join(', ') : '';

  return (
    <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <GripVertical size={14} className="text-white/20 shrink-0 cursor-grab" />
        <input
          type="text"
          placeholder="Project title"
          className="flex-1 bg-transparent text-sm font-medium border-none outline-none placeholder-white/25 min-w-0"
          {...field('title')}
        />
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={() => onMove('up')} disabled={index === 0}
            className="p-1 rounded text-white/25 hover:text-white disabled:opacity-20 transition-colors" title="Move up"
          >↑</button>
          <button
            onClick={() => onMove('down')} disabled={index === total - 1}
            className="p-1 rounded text-white/25 hover:text-white disabled:opacity-20 transition-colors" title="Move down"
          >↓</button>
          <button
            onClick={onRemove}
            className="p-1 rounded text-white/25 hover:text-red-400 transition-colors" title="Delete"
          ><Trash2 size={13} /></button>
        </div>
      </div>

      {/* Description */}
      <textarea
        placeholder="Brief project description"
        rows={2}
        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white resize-none focus:outline-none focus:border-white/30 transition-colors"
        {...field('description')}
      />

      {/* Image URL with inline preview */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Image URL"
          className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 transition-colors min-w-0"
          {...field('imageUrl')}
        />
        {project.imageUrl && (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-9 h-9 object-cover rounded border border-white/10 shrink-0"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}
      </div>

      {/* Project link */}
      <input
        type="text"
        placeholder="Project URL (https://...)"
        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 transition-colors"
        {...field('link')}
      />

      {/* Tags */}
      <div className="space-y-1">
        <label className="text-xs text-white/35">Tags (comma-separated)</label>
        <input
          type="text"
          placeholder="React, TypeScript, GSAP"
          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 transition-colors"
          value={tagsDisplay}
          onChange={e => setDraft(d => ({ ...d, tags: e.target.value.split(',').map(t => t.trim()) }))}
          onBlur={e => {
            const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
            if (JSON.stringify(tags) !== JSON.stringify(project.tags)) onUpdate({ tags });
          }}
        />
      </div>
    </div>
  );
}

// ── WorkPanel ─────────────────────────────────────────────────────────────────
export function WorkPanel({ sectionId }: { sectionId: string }) {
  // Targeted selectors — only subscribe to the data we need
  const config = usePortfolioStore(
    useCallback(s => s.sections.find(sec => sec.id === sectionId)?.config as WorkSectionConfig | undefined, [sectionId])
  );
  const updateSectionConfig = usePortfolioStore(s => s.updateSectionConfig);

  if (!config) return null;
  const projects = config.projects || [];

  const addProject = () => {
    updateSectionConfig(sectionId, {
      projects: [...projects, {
        id: `proj-${Date.now()}`,
        title: 'New Project',
        description: 'Brief project description',
        imageUrl: '',
        link: '',
        tags: [],
      }],
    });
  };

  const updateProject = (index: number, updates: Partial<Project>) => {
    const next = [...projects];
    next[index] = { ...next[index], ...updates };
    updateSectionConfig(sectionId, { projects: next });
  };

  const removeProject = (index: number) => {
    updateSectionConfig(sectionId, { projects: projects.filter((_, i) => i !== index) });
  };

  const moveProject = (index: number, dir: 'up' | 'down') => {
    const next = [...projects];
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    updateSectionConfig(sectionId, { projects: next });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">
          Projects ({projects.length})
        </h3>
        <button
          onClick={addProject}
          className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
        >
          <Plus size={12} /> Add
        </button>
      </div>

      {projects.length === 0 ? (
        <p className="text-white/30 text-sm text-center py-6 border border-dashed border-white/10 rounded-lg">
          No projects yet — click Add to create your first.
        </p>
      ) : (
        <div className="space-y-3">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              total={projects.length}
              onUpdate={updates => updateProject(index, updates)}
              onRemove={() => removeProject(index)}
              onMove={dir => moveProject(index, dir)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
