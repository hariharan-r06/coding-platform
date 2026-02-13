import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
            setUnreadCount(res.data.filter(n => !n.is_read).length);
        } catch (err) {
            console.error('Error fetching notifications', err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Poll every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error(err);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'submission_update':
                return <CheckCircle2 className="text-success" size={18} />;
            case 'new_submission':
                return <AlertCircle className="text-warning" size={18} />;
            case 'new_problem':
            case 'new_pattern':
                return <Info className="text-primary" size={18} />;
            default:
                return <Bell className="text-muted" size={18} />;
        }
    };

    return (
        <div className="relative">
            {/* 🔔 Bell */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-white/10 transition"
            >
                <Bell size={22} className="text-slate-200" />

                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow border-2 border-[#0f172a]">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-3 w-[400px] bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">

                        {/* Arrow Tip */}
                        <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-slate-200 rotate-45"></div>

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                            <h3 className="text-base font-bold text-slate-800 tracking-wide">
                                Notifications
                            </h3>

                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider transition-colors"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="py-16 px-6 text-center flex flex-col items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                        <Bell size={24} />
                                    </div>
                                    <p className="text-slate-500 font-medium">No new notifications</p>
                                </div>
                            ) : (
                                notifications.map(notification => (
                                    <div
                                        key={notification.id}
                                        onClick={() =>
                                            !notification.is_read &&
                                            handleMarkAsRead(notification.id)
                                        }
                                        className={`px-6 py-5 flex gap-4 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100 last:border-0 ${!notification.is_read
                                            ? "bg-indigo-50"
                                            : ""
                                            }`}
                                    >
                                        {/* Icon */}
                                        <div className="mt-1 flex-shrink-0">
                                            {getNotificationIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1.5">
                                                <p
                                                    className={`text-sm ${notification.is_read
                                                        ? "text-slate-600 font-medium"
                                                        : "text-slate-900 font-bold"
                                                        }`}
                                                >
                                                    {notification.title}
                                                </p>

                                                <span className="text-[11px] text-slate-400 whitespace-nowrap ml-3">
                                                    {new Date(
                                                        notification.created_at
                                                    ).toLocaleDateString([], {
                                                        month: "short",
                                                        day: "numeric"
                                                    })}
                                                </span>
                                            </div>

                                            <p className={`text-sm leading-relaxed ${notification.is_read ? "text-slate-500" : "text-slate-700"}`}>
                                                {notification.message}
                                            </p>

                                            {!notification.is_read && (
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                                    <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wide">New</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );


};

export default NotificationBell;
