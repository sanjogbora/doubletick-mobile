import React, { useState } from 'react';
import { Check, Clock, AlertCircle, FileText, ArrowRight, Target, DollarSign, CheckCircle, Sparkle } from 'lucide-react';
import { AISuggestion, PriorityLevel, ActionType } from '../types';
import { MOCK_PROACTIVE_SUGGESTIONS } from '../constants';
import TemplateReviewModal from './TemplateReviewModal';
import ProactiveActionModal from './ProactiveActionModal';

interface ActionCenterProps {
    allSuggestions: { chatId: string; contactName: string; contactAvatar?: string; suggestion: AISuggestion }[];
    onAccept: (chatId: string, suggestionId: string, action: ActionType, payload: any) => void;
    onDismiss: (chatId: string, suggestionId: string) => void;
}

const ActionCenter: React.FC<ActionCenterProps> = ({
    allSuggestions,
    onAccept,
    onDismiss
}) => {
    const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
    const [activeTab, setActiveTab] = useState<'ACTIVE' | 'PROACTIVE'>('ACTIVE');

    // Modal States
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewingAction, setReviewingAction] = useState<{
        chatId: string;
        suggestionId: string;
        actionType: ActionType;
        payload: any;
    } | null>(null);

    const [isProactiveModalOpen, setIsProactiveModalOpen] = useState(false);
    const [proactiveAction, setProactiveAction] = useState<{
        suggestion: AISuggestion;
        contactName: string;
        contactAvatar?: string;
        chatId: string;
        suggestionId: string;
    } | null>(null);

    // Choose source based on tab
    const sourceSuggestions = activeTab === 'ACTIVE' ? allSuggestions : MOCK_PROACTIVE_SUGGESTIONS;

    const filteredSuggestions = sourceSuggestions.filter(item => {
        if (filter === 'ALL') return true;
        return item.suggestion.priority === (filter === 'HIGH' ? PriorityLevel.HIGH : filter === 'MEDIUM' ? PriorityLevel.MEDIUM : PriorityLevel.LOW);
    });

    // Grouping Logic (Same as before)
    const actionGroups = filteredSuggestions.reduce((acc, item) => {
        const key = `${item.suggestion.actionType}_${item.suggestion.title}`;
        if (!acc[key]) {
            acc[key] = {
                actionType: item.suggestion.actionType,
                title: item.suggestion.title,
                description: item.suggestion.description,
                payload: item.suggestion.payload,
                contacts: []
            };
        }
        acc[key].contacts.push({
            chatId: item.chatId,
            name: item.contactName,
            avatar: item.contactAvatar,
            suggestionId: item.suggestion.id
        });
        return acc;
    }, {} as Record<string, {
        actionType: ActionType;
        title: string;
        description: string;
        payload: any;
        contacts: Array<{ chatId: string; name: string; avatar?: string; suggestionId: string }>
    }>);

    const groupedActions = (Object.values(actionGroups) as any[]).filter(group => group.contacts.length > 1);

    const groupedByChat = filteredSuggestions.reduce((acc, item) => {
        const isGrouped = groupedActions.some(ga =>
            ga.actionType === item.suggestion.actionType &&
            ga.title === item.suggestion.title
        );

        if (isGrouped) return acc;

        if (!acc[item.chatId]) {
            acc[item.chatId] = {
                chatId: item.chatId,
                contactName: item.contactName,
                contactAvatar: item.contactAvatar,
                suggestions: []
            };
        }
        acc[item.chatId].suggestions.push(item.suggestion);
        return acc;
    }, {} as Record<string, { chatId: string; contactName: string; contactAvatar?: string; suggestions: AISuggestion[] }>);

    const getIcon = (type: ActionType, title?: string) => {
        if (title?.includes('Inactive Lead')) return <Clock size={16} />;
        if (title?.includes('Frustration')) return <AlertCircle size={16} />;
        if (title?.includes('Priorities')) return <Target size={16} />;
        if (title?.includes('Upsell')) return <DollarSign size={16} />;

        switch (type) {
            case ActionType.SCHEDULE_FOLLOWUP: return <Clock size={16} />;
            case ActionType.SEND_TEMPLATE: return <FileText size={16} />;
            case ActionType.ESCALATE: return <AlertCircle size={16} />;
            default: return <ArrowRight size={16} />;
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-50 w-full">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 pt-safe-top">
                <div className="px-5 py-4 pb-0 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Sparkle className="text-indigo-600 fill-indigo-100" size={24} />
                        Converso
                    </h2>
                    <div className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded-full border border-indigo-100">
                        BETA
                    </div>
                </div>

                {/* Sub-Tabs */}
                <div className="flex px-5 pt-4 border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('ACTIVE')}
                        className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'ACTIVE' ? 'text-indigo-600 border-indigo-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setActiveTab('PROACTIVE')}
                        className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'PROACTIVE' ? 'text-indigo-600 border-indigo-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                    >
                        Proactive
                    </button>
                </div>

                {/* Filters & Actions */}
                <div className="p-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`text-[10px] font-bold px-3 py-2 rounded-full border transition-all whitespace-nowrap uppercase tracking-wide ${filter === f
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                } `}
                        >
                            {f}
                        </button>
                    ))}

                    {filteredSuggestions.length > 0 && (
                        <div className="h-6 w-px bg-gray-200 mx-1"></div>
                    )}

                    {filteredSuggestions.length > 0 && (
                        <button
                            onClick={() => {
                                filteredSuggestions.forEach(item => {
                                    onAccept(item.chatId, item.suggestion.id, item.suggestion.actionType, item.suggestion.payload);
                                });
                            }}
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 whitespace-nowrap bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-full border border-indigo-200 transition-colors ml-auto"
                        >
                            <CheckCircle size={12} />
                            Accept All
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 [&::-webkit-scrollbar]:hidden">
                {/* Grouped Actions */}
                {groupedActions.map((group, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex items-center gap-3">
                            <div className={`p-1.5 rounded-lg ${group.actionType === ActionType.SEND_TEMPLATE ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-indigo-600 shadow-sm'}`}>
                                {getIcon(group.actionType, group.title)}
                            </div>
                            <div className="flex-1">
                                <span className="text-sm font-bold text-gray-900 block">{group.title}</span>
                                <span className="text-[10px] text-indigo-600 font-medium">
                                    {group.contacts.length} contacts affected
                                </span>
                            </div>
                        </div>

                        <div className="p-4">
                            <p className="text-xs text-gray-500 mb-4">{group.description}</p>

                            <div className="flex items-center gap-3 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="flex -space-x-2">
                                    {group.contacts.slice(0, 3).map((contact: any, i: number) => (
                                        <img
                                            key={i}
                                            className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                            src={contact.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=random`}
                                            alt={contact.name}
                                        />
                                    ))}
                                </div>
                                <div className="flex-1 text-xs text-gray-600 font-medium">
                                    {group.contacts.slice(0, 2).map((c: any) => c.name.split(' ')[0]).join(', ')}
                                    {group.contacts.length > 2 && ` +${group.contacts.length - 2} more`}
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    if (group.actionType === ActionType.SEND_TEMPLATE) {
                                        const firstContact = group.contacts[0];
                                        setReviewingAction({
                                            chatId: firstContact.chatId,
                                            suggestionId: firstContact.suggestionId,
                                            actionType: group.actionType,
                                            payload: group.payload
                                        });
                                        setIsReviewModalOpen(true);
                                    } else {
                                        group.contacts.forEach((contact: any) => {
                                            onAccept(contact.chatId, contact.suggestionId, group.actionType, group.payload);
                                        });
                                    }
                                }}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm shadow-indigo-200 transition-colors w-full flex items-center justify-center gap-2 active:scale-[0.98]"
                            >
                                {getIcon(group.actionType, group.title)}
                                {group.actionType === ActionType.SEND_TEMPLATE ? 'Review & Send' : 'Schedule'} for All ({group.contacts.length})
                            </button>
                        </div>
                    </div>
                ))}

                {/* Individual Actions */}
                {Object.values(groupedByChat).length === 0 && groupedActions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Check size={32} className="text-gray-300" />
                        </div>
                        <p className="font-medium">All caught up!</p>
                        <p className="text-sm text-gray-400">No pending actions</p>
                    </div>
                ) : (
                    Object.values(groupedByChat).map(({ chatId, contactName, contactAvatar, suggestions }) => (
                        <div key={chatId} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                                <img
                                    src={contactAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contactName)}&background=random`}
                                    alt={contactName}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <span className="text-sm font-bold text-gray-900 block">{contactName}</span>
                                </div>
                                <span className="text-[10px] text-gray-500 bg-white px-2 py-1 rounded-full border border-gray-200 font-medium">
                                    {suggestions.length} actions
                                </span>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {suggestions.map(suggestion => (
                                    <div key={suggestion.id} className="p-4 active:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1.5 rounded-lg ${suggestion.priority === PriorityLevel.HIGH ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                                    {getIcon(suggestion.actionType, suggestion.title)}
                                                </div>
                                                <h4 className="text-sm font-bold text-gray-800">{suggestion.title}</h4>
                                            </div>
                                            {suggestion.priority === PriorityLevel.HIGH && (
                                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] rounded font-bold uppercase tracking-wide">High</span>
                                            )}
                                        </div>

                                        <div className="pl-9">
                                            <p className="text-xs text-gray-500 mb-4 leading-relaxed">{suggestion.description}</p>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => onDismiss(chatId, suggestion.id)}
                                                    className="flex-1 text-xs font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-2.5 rounded-xl transition-colors"
                                                >
                                                    Dismiss
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (activeTab === 'PROACTIVE') {
                                                            setProactiveAction({
                                                                suggestion,
                                                                contactName,
                                                                contactAvatar,
                                                                chatId,
                                                                suggestionId: suggestion.id
                                                            });
                                                            setIsProactiveModalOpen(true);
                                                        } else if (suggestion.actionType === ActionType.SEND_TEMPLATE) {
                                                            setReviewingAction({
                                                                chatId,
                                                                suggestionId: suggestion.id,
                                                                actionType: suggestion.actionType,
                                                                payload: suggestion.payload
                                                            });
                                                            setIsReviewModalOpen(true);
                                                        } else {
                                                            onAccept(chatId, suggestion.id, suggestion.actionType, suggestion.payload);
                                                        }
                                                    }}
                                                    className="flex-[2] text-xs bg-gray-900 hover:bg-black text-white px-3 py-2.5 rounded-xl font-bold transition-colors shadow-sm active:scale-[0.98]"
                                                >
                                                    {activeTab === 'PROACTIVE' ? 'Review Action' : (suggestion.title.includes('Priorities') ? 'View Dashboard' : (suggestion.actionType === ActionType.SEND_TEMPLATE ? 'Review & Send' : (suggestion.actionType === ActionType.SCHEDULE_FOLLOWUP ? 'Schedule Call' : 'Execute')))}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Template Review Modal */}
            <TemplateReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => {
                    setIsReviewModalOpen(false);
                    setReviewingAction(null);
                }}
                onConfirm={(templateName) => {
                    if (reviewingAction) {
                        const updatedPayload = {
                            ...reviewingAction.payload,
                            templateName
                        };
                        onAccept(
                            reviewingAction.chatId,
                            reviewingAction.suggestionId,
                            reviewingAction.actionType,
                            updatedPayload
                        );
                    }
                    setIsReviewModalOpen(false);
                    setReviewingAction(null);
                }}
            />

            {/* Proactive Action Modal */}
            <ProactiveActionModal
                isOpen={isProactiveModalOpen}
                onClose={() => {
                    setIsProactiveModalOpen(false);
                    setProactiveAction(null);
                }}
                suggestion={proactiveAction?.suggestion || null}
                contactName={proactiveAction?.contactName}
                onConfirm={(action, payload) => {
                    if (proactiveAction) {
                        onAccept(
                            proactiveAction.chatId,
                            proactiveAction.suggestionId,
                            proactiveAction.suggestion.actionType,
                            payload
                        );
                    }
                    setIsProactiveModalOpen(false);
                    setProactiveAction(null);
                }}
            />
        </div>
    );
};

export default ActionCenter;
