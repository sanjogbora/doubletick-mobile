import React, { useState } from 'react';
import { X, FileText, Upload, Check, Search, Eye, Send } from 'lucide-react';

interface TemplateReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (templateName: string) => void;
}

const TemplateReviewModal: React.FC<TemplateReviewModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const templates = [
        { id: '1', name: 'Product_Catalog_v2.pdf', size: '2.4 MB', type: 'PDF' },
        { id: '2', name: 'Company_Profile_2024.pdf', size: '1.8 MB', type: 'PDF' },
        { id: '3', name: 'Pricing_Tier_Enterprise.pdf', size: '850 KB', type: 'PDF' },
        { id: '4', name: 'Onboarding_Checklist.pdf', size: '420 KB', type: 'PDF' },
    ];

    const filteredTemplates = templates.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-end justify-center pointer-events-none">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity pointer-events-auto"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div className="bg-white w-full rounded-t-[32px] shadow-2xl transform transition-transform duration-300 ease-out max-h-[90vh] flex flex-col pointer-events-auto animate-[slideIn_0.3s_ease-out]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">Select Document</h3>
                            <p className="text-xs text-emerald-600 font-medium">Send to Customer</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Search & Upload */}
                <div className="px-6 pt-6 pb-2 space-y-4">
                    <div className="relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search documents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm font-medium"
                        />
                    </div>

                    <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-500 font-semibold hover:bg-gray-50 hover:border-emerald-400 hover:text-emerald-600 transition-all">
                        <Upload size={18} />
                        <span>Upload New File</span>
                    </button>
                </div>

                {/* Template List */}
                <div className="p-6 overflow-y-auto flex-1 space-y-3 [&::-webkit-scrollbar]:hidden">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Available Documents</h4>
                    {filteredTemplates.map((template) => (
                        <div
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.name)}
                            className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${selectedTemplate === template.name
                                ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                                : 'bg-white border-gray-100 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <p className={`font-bold text-sm ${selectedTemplate === template.name ? 'text-emerald-900' : 'text-gray-800'}`}>
                                        {template.name}
                                    </p>
                                    <p className="text-xs text-gray-500">{template.size} • {template.type}</p>
                                </div>
                            </div>
                            {selectedTemplate === template.name && (
                                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                                    <Check size={14} strokeWidth={3} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-white pb-8 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 text-gray-600 font-bold text-base bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Dismiss
                    </button>
                    <button
                        onClick={() => selectedTemplate && onConfirm(selectedTemplate)}
                        disabled={!selectedTemplate}
                        className={`flex-[2] font-bold text-base py-2.5 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${selectedTemplate
                            ? 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                            }`}
                    >
                        <Send size={18} />
                        <span>Send Document</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TemplateReviewModal;
