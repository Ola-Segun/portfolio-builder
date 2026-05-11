import { Plus } from 'lucide-react';

interface AddSectionButtonProps {
  onClick: () => void;
}

export function AddSectionButton({ onClick }: AddSectionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-dashed border-white/15 rounded-lg text-white/40 hover:text-white/70 hover:border-white/30 hover:bg-white/5 transition-all duration-200 text-sm"
    >
      <Plus size={16} />
      Add Section
    </button>
  );
}
