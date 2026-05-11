import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  DndContext, DragOverlay, PointerSensor,
  useSensor, useSensors, closestCenter,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { usePortfolioStore }  from '../store/portfolioStore';
import { useUIStore }         from '../store/uiStore';
import { bridge }             from '../preview/PreviewBridge';
import { SortableSection }    from './SortableSection';

export function SectionStrip() {
  const sections           = usePortfolioStore(s => s.sections);
  const reorderSections    = usePortfolioStore(s => s.reorderSections);
  const removeSection      = usePortfolioStore(s => s.removeSection);
  const duplicateSection   = usePortfolioStore(s => s.duplicateSection);
  const activeSectionId    = useUIStore(s => s.activeSectionId);
  const setActiveSectionId = useUIStore(s => s.setActiveSectionId);

  const [activeId,       setActiveId]       = useState<string | null>(null);
  const [confirmDelete,  setConfirmDelete]  = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex(s => s.id === active.id);
      const newIndex = sections.findIndex(s => s.id === over.id);
      reorderSections(arrayMove(sections, oldIndex, newIndex).map(s => s.id));
    }
    setActiveId(null);
  }, [sections, reorderSections]);

  const activeSection = sections.find(s => s.id === activeId);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.08em]">
            Layers
          </span>
          {sections.length > 0 && (
            <span className="text-[9px] bg-white/8 text-white/35 rounded px-1.5 py-0.5 font-mono">
              {sections.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          {/* Collapse all hint */}
          <span className="text-[9px] text-white/18">drag to reorder</span>
        </div>
      </div>

      {/* ── Sections list ───────────────────────────────────────────────── */}
      {sections.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex items-center justify-center p-6 text-center"
        >
          <div className="space-y-1">
            <div className="text-[11px] text-white/25">No sections yet</div>
            <div className="text-[9px] text-white/15">Add from the palette above</div>
          </div>
        </motion.div>
      ) : (
        <div className="flex-1 section-strip-scroll px-1 py-1">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={e => setActiveId(e.active.id as string)}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
              <AnimatePresence initial={false}>
                {sections.map(section => (
                  <motion.div
                    key={section.id}
                    layout
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -12, scale: 0.96 }}
                    transition={{ duration: 0.12, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <SortableSection
                      section={section}
                      isSelected={activeSectionId === section.id}
                      isConfirmingDelete={confirmDelete === section.id}
                      onSelect={() => {
                        const newId = activeSectionId === section.id ? null : section.id;
                        setActiveSectionId(newId);
                        if (newId) bridge.scrollToSection(newId);
                      }}
                      onDuplicate={() => duplicateSection(section.id)}
                      onRequestDelete={() => setConfirmDelete(section.id)}
                      onConfirmDelete={() => { removeSection(section.id); setConfirmDelete(null); }}
                      onCancelDelete={() => setConfirmDelete(null)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </SortableContext>

            {/* Drag ghost overlay */}
            <DragOverlay dropAnimation={{ duration: 120, easing: 'ease' }}>
              {activeSection ? (
                <div className="layer-row bg-[#1f1f1f] border border-white/20 shadow-2xl backdrop-blur-sm rounded-md px-2">
                  <span className="text-[11px] font-medium text-white capitalize">{activeSection.type}</span>
                  <span className="text-[9px] text-white/30 font-mono ml-auto">#{activeSection.id.slice(-4)}</span>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}
    </div>
  );
}
