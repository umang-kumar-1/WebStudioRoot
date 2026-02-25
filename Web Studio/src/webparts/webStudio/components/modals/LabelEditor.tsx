
import { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { GenericModal } from './SharedModals';

export const LabelEditorModal = () => {
  const { editingLabelKey, uiLabels, updateLabel, closeModal, currentLanguage } = useStore();
  const [text, setText] = useState('');

  useEffect(() => {
    if (editingLabelKey && uiLabels[editingLabelKey]) {
      setText(uiLabels[editingLabelKey][currentLanguage] || '');
    }
  }, [editingLabelKey, currentLanguage, uiLabels]);

  if (!editingLabelKey) return null;

  return (
    <GenericModal className="label-editor-popup" title="Edit Interface Label" onClose={closeModal} width="max-w-md" noFooter={true}>
      <div className="p-1">
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">System Key</label>
          <code className="block bg-gray-100 p-2 text-xs text-gray-600 font-mono border border-gray-200">{editingLabelKey}</code>
        </div>
        <div className="mb-6">
          <label className="block text-xs font-bold text-blue-600 uppercase mb-1">Translation ({currentLanguage.toUpperCase()})</label>
          <input
            className="w-full border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-inner bg-yellow-50/50"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter translation..."
            autoFocus
          />
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <button onClick={closeModal} className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100">Cancel</button>
          <button onClick={() => updateLabel(editingLabelKey, text, currentLanguage)} className="px-6 py-2 bg-blue-600 text-white text-xs font-bold shadow-sm hover:bg-blue-700">Save Translation</button>
        </div>
      </div>
    </GenericModal>
  );
};
