import React from 'react';
import { X, Ticket, LayoutGrid, ShoppingBag } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { useCart } from '../context/CartContext';
import OrderTicket from './OrderTicket';

const TokenModal: React.FC = () => {
    const { isTokenModalOpen, closeTokenModal, tokenModalOrderId } = useModal();
    const { bookedOrders, lastOrderToken } = useCart();

    // If orderId is provided, show that specific one. Otherwise show the latest or all active.
    const displayOrders = tokenModalOrderId
        ? bookedOrders.filter(o => o.id === tokenModalOrderId)
        : bookedOrders;

    return (
        isTokenModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div
                    onClick={closeTokenModal}
                    className="absolute inset-0 bg-black/50"
                />

                <div className="relative bg-slate-50 w-full max-w-2xl max-h-[90vh] rounded-lg overflow-hidden shadow-lg flex flex-col">
                    {/* Header */}
                    <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                                <Ticket size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 leading-tight">
                                    {tokenModalOrderId ? 'Order Token' : 'My Active Tokens'}
                                </h2>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider leading-none">
                                    {displayOrders.length} {displayOrders.length === 1 ? 'Token' : 'Tokens'} Available
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={closeTokenModal}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-8">
                        {displayOrders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-300 mb-4">
                                    <ShoppingBag size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">No active tokens</h3>
                                <p className="text-slate-500 max-w-xs text-sm">
                                    Book an order to generate a digital token for counter pickup.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-8 pb-4">
                                {displayOrders.map((order) => (
                                    <div key={order.id} className="relative">
                                        <OrderTicket order={order} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer / Call to action */}
                    {displayOrders.length > 0 && (
                        <div className="p-4 bg-white border-t border-slate-200 text-center">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Show these at the pickup counter
                            </p>
                            <div className="bg-blue-600 p-3 rounded-lg text-white flex items-center justify-center gap-2">
                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                <p className="text-xs font-semibold">Orders are processed in queue order</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    );
};

export default TokenModal;
