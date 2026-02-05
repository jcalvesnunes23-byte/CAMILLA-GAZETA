import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';

const DashboardHours: React.FC = () => {
    const { availability, toggleDayAvailability, updateDaySlots, bookedSlots } = useStudio();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Generate hours from 09:00 to 22:00
    const allHours = Array.from({ length: 14 }, (_, i) => {
        const h = i + 9;
        return `${h.toString().padStart(2, '0')}:00`;
    });

    const goToPrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });
    const year = currentDate.getFullYear();

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const formatDateStr = (day: number) => {
        const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return d.toISOString().split('T')[0];
    };

    const handleDayClick = (day: number) => {
        setSelectedDate(formatDateStr(day));
    };

    const toggleHour = (date: string, hour: string) => {
        const currentData = availability[date] || { available: false, slots: [] };
        let newSlots;
        if (currentData.slots.includes(hour)) {
            newSlots = currentData.slots.filter(s => s !== hour);
        } else {
            newSlots = [...currentData.slots, hour].sort();
        }
        updateDaySlots(date, newSlots);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center bg-card-dark p-6 rounded-2xl border border-white/5">
                <div>
                    <h3 className="text-white font-bold uppercase tracking-wide">Gerenciar Horários</h3>
                    <p className="text-slate-500 text-xs mt-1">Configure dias de atendimento e horários específicos</p>
                </div>
                <div className="flex items-center gap-4 bg-background-dark p-2 rounded-xl border border-white/5">
                    <button onClick={goToPrevMonth} className="p-2 hover:bg-white/5 rounded-lg text-slate-400">
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <span className="text-white font-bold uppercase text-sm min-w-[120px] text-center">
                        {monthName} {year}
                    </span>
                    <button onClick={goToNextMonth} className="p-2 hover:bg-white/5 rounded-lg text-slate-400">
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* CALENDAR GRID */}
                <div className="lg:col-span-2 bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
                    <div className="p-6 border-b border-white/5 bg-white/2">
                        <div className="grid grid-cols-7 text-center mb-2">
                            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                                <span key={d} className="text-[10px] uppercase font-black text-slate-500">{d}</span>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-square opacity-0"></div>
                            ))}
                            {(() => {
                                const today = new Date();
                                const activeDates = [];
                                let checkDate = new Date(today);
                                checkDate.setDate(today.getDate() + 1);

                                while (activeDates.length < 7) {
                                    const dateStr = checkDate.toISOString().split('T')[0];
                                    const isSun = checkDate.getDay() === 0;
                                    const dayData = availability[dateStr];
                                    if (!isSun && dayData?.available && dayData.slots.length > 0) {
                                        activeDates.push(dateStr);
                                    }
                                    checkDate.setDate(checkDate.getDate() + 1);
                                    if (checkDate.getTime() > today.getTime() + 1000 * 60 * 60 * 24 * 60) break;
                                }
                                const activeDatesSet = new Set(activeDates);

                                return Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = i + 1;
                                    const dateStr = formatDateStr(day);
                                    const dayData = availability[dateStr];
                                    const isSelected = selectedDate === dateStr;
                                    const isSunday = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getDay() === 0;
                                    const isOpen = dayData?.available && dayData.slots.length > 0;
                                    const isActiveWindow = activeDatesSet.has(dateStr);

                                    return (
                                        <button
                                            key={day}
                                            onClick={() => handleDayClick(day)}
                                            className={`
                                                aspect-square rounded-xl flex flex-col items-center justify-center gap-1 border transition-all text-sm relative
                                                ${isSelected ? 'ring-2 ring-primary border-transparent' : 'border-white/5'}
                                                ${isActiveWindow ? 'ring-1 ring-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.15)] border-green-500/30' : ''}
                                                ${isSunday ? 'opacity-30' : ''}
                                                ${isOpen ? 'bg-primary/20 text-white' : 'bg-background-dark/50 text-slate-500'}
                                                hover:border-primary/50
                                            `}
                                        >
                                            <span className="font-bold">{day}</span>
                                            {isOpen && (
                                                <span className="text-[8px] font-black uppercase text-primary">
                                                    {dayData.slots.length} h
                                                </span>
                                            )}
                                            {isOpen && (
                                                <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                            )}
                                        </button>
                                    );
                                });
                            })()}
                        </div>
                        <div className="mt-6 flex flex-wrap gap-4 px-2 py-4 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]"></div>
                                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">7 Dias Ativos no Site</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Horários Disponíveis</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SLOTS PANEL */}
                <div className="bg-card-dark rounded-2xl border border-white/5 flex flex-col min-h-[500px]">
                    {selectedDate ? (
                        <>
                            <div className="p-6 border-b border-white/5">
                                <h4 className="text-white font-bold text-sm uppercase">
                                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </h4>
                                <div className="mt-4 flex items-center justify-between">
                                    <button
                                        onClick={() => toggleDayAvailability(selectedDate)}
                                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all border ${availability[selectedDate]?.available
                                            ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                            : 'bg-green-500/10 border-green-500/30 text-green-400'
                                            }`}
                                    >
                                        {availability[selectedDate]?.available ? 'Fechar Dia' : 'Abrir Dia'}
                                    </button>
                                </div>
                            </div>
                            <div className="flex-grow p-6 overflow-y-auto">
                                <label className="text-[10px] font-black text-slate-500 uppercase block mb-4">Escolha os horários disponíveis:</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {allHours.map(hour => {
                                        const isEnabled = availability[selectedDate]?.slots.includes(hour);
                                        const isDayOpen = availability[selectedDate]?.available;
                                        const isBooked = bookedSlots.some(b =>
                                            b.date === selectedDate &&
                                            b.time === hour &&
                                            b.status !== 'cancelled'
                                        );
                                        return (
                                            <button
                                                key={hour}
                                                disabled={!isDayOpen}
                                                onClick={() => toggleHour(selectedDate, hour)}
                                                className={`
                                                    p-3 rounded-xl border text-xs font-bold transition-all relative
                                                    ${isEnabled
                                                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                                        : 'bg-white/5 border-white/10 text-slate-400'}
                                                    ${!isDayOpen ? 'opacity-20 cursor-not-allowed' : 'hover:border-primary/50'}
                                                `}
                                            >
                                                {hour}
                                                {isBooked && (
                                                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-card-dark shadow-lg ring-1 ring-red-500/50" title="Horário já ocupado"></div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center text-slate-500">
                            <span className="material-symbols-outlined text-4xl mb-4 opacity-20">calendar_month</span>
                            <p className="text-sm">Selecione um dia no calendário para configurar os horários</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardHours;
