import React from 'react';
import { useStudio } from '../../context/StudioContext';

const DashboardAgenda: React.FC = () => {
    const { bookings, updateBookingStatus } = useStudio();

    const sortedBookings = [...bookings].sort((a, b) => {
        // Simple sort by date string (ideal would be real Date objects, but string '4 de Fevereiro' is tricky without parsing.
        // For prototype, we assume insertion order roughly correlates or we'd parse.
        // Let's just reverse to show newest first for now, or group by date.
        return 0;
    }).reverse();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h3 className="text-white font-bold uppercase tracking-wide">Agenda de Atendimentos</h3>
            </div>

            <div className="bg-card-dark rounded-xl border border-white/5 overflow-hidden">
                {bookings.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        <span className="material-symbols-outlined text-4xl mb-2">event_busy</span>
                        <p>Nenhum agendamento encontrado.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-white/5 text-xs uppercase font-bold text-white">
                                <tr>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Data/Hora</th>
                                    <th className="p-4">Cliente</th>
                                    <th className="p-4">Serviço</th>
                                    <th className="p-4">Contato</th>
                                    <th className="p-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {sortedBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase
                        ${booking.status === 'confirmed' ? 'bg-blue-500/10 text-blue-400' :
                                                    booking.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                                                        'bg-red-500/10 text-red-400'
                                                }
                      `}>
                                                {booking.status === 'confirmed' ? 'Confirmado' :
                                                    booking.status === 'completed' ? 'Concluído' : 'Cancelado'}
                                            </span>
                                        </td>
                                        <td className="p-4 font-medium text-white">
                                            {booking.date} <br />
                                            <span className="text-slate-500 text-xs">{booking.time}</span>
                                        </td>
                                        <td className="p-4 font-bold">{booking.customerName}</td>
                                        <td className="p-4">{booking.serviceId}</td>
                                        <td className="p-4 text-xs">
                                            {booking.customerPhone} <br />
                                            {booking.customerEmail}
                                        </td>
                                        <td className="p-4 text-right">
                                            {booking.status === 'confirmed' && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => updateBookingStatus(booking.id, 'completed')}
                                                        className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                                                        title="Concluir Atendimento"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">check_circle</span>
                                                    </button>
                                                    <button
                                                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                                        title="Cancelar Agendamento"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">cancel</span>
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardAgenda;
