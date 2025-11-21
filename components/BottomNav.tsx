import React from 'react';
import { MessageSquare, Sparkle, Users, BookOpen, Settings } from 'lucide-react';

interface BottomNavProps {
    activeView: 'MESSAGES' | 'ACTIONS' | 'CONTACTS' | 'BROADCAST' | 'SETTINGS';
    onViewChange: (view: 'MESSAGES' | 'ACTIONS' | 'CONTACTS' | 'BROADCAST' | 'SETTINGS') => void;
    hasSuggestions?: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onViewChange, hasSuggestions }) => {
    const navItems = [
        { id: 'MESSAGES', label: 'Inbox', icon: MessageSquare },
        { id: 'ACTIONS', label: 'Converso', icon: Sparkle, hasBadge: hasSuggestions },
        { id: 'CONTACTS', label: 'Contacts', icon: Users },
        { id: 'BROADCAST', label: 'Broadcast', icon: BookOpen },
        { id: 'SETTINGS', label: 'Settings', icon: Settings },
    ] as const;

    return (
        <div className="bg-white border-t border-gray-200 flex justify-between items-center h-[72px] px-2 pb-2 absolute bottom-0 left-0 right-0 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all active:scale-95 ${activeView === item.id ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <div className={`relative p-1.5 rounded-xl transition-colors ${activeView === item.id ? 'bg-indigo-50' : ''}`}>
                        <item.icon
                            size={24}
                            strokeWidth={activeView === item.id ? 2.5 : 2}
                            className={activeView === item.id ? 'fill-indigo-100' : ''}
                        />
                        {item.hasBadge && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                        )}
                    </div>
                    <span className={`text-[10px] font-medium tracking-wide ${activeView === item.id ? 'font-bold' : ''}`}>
                        {item.label}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default BottomNav;
