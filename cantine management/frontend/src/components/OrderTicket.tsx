import React, { useRef } from 'react';
import { QrCode, Utensils, Clock, MapPin, CheckCircle2, Receipt, Download, FileText } from 'lucide-react';
import { OrderCoupon } from '../context/CartContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface OrderTicketProps {
  order: OrderCoupon;
}

const OrderTicket: React.FC<OrderTicketProps> = ({ order }) => {
  const ticketRef = useRef<HTMLDivElement>(null);

  const downloadTicket = async () => {
    if (!ticketRef.current) return;

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 150] // Custom size for ticket
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Token-${order.id}.pdf`);
    } catch (e) {
      console.error('Failed to generate PDF:', e);
    }
  };
  return (
    <div className="space-y-4">
      <div
        ref={ticketRef}
        className="relative w-full max-w-md mx-auto shadow-md"
      >
        {/* Decorative Top Border */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-orange-500 rounded-full z-20 opacity-50" />

        {/* Main Ticket Body */}
        <div className="bg-white rounded-lg overflow-hidden border border-slate-200">

          {/* Header Section */}
          <div className="bg-slate-50 p-6 pb-4 border-b border-dashed border-slate-200 relative">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                  <Receipt size={24} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-0.5">Order Token</h3>
                  <p className="text-xl font-bold text-slate-900 leading-none">{order.id}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 ${order.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                  order.status === 'Preparing' ? 'bg-blue-100 text-blue-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'Pending' ? 'bg-orange-600' :
                    order.status === 'Preparing' ? 'bg-blue-600' :
                      'bg-emerald-600'
                    }`} />
                  {order.status}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs font-bold text-slate-500">
                      {item.quantity}x
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                  <Clock size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Time</p>
                  <p className="text-xs font-semibold text-slate-900">{order.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                  <MapPin size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Location</p>
                  <p className="text-xs font-semibold text-slate-900">{order.pickupLocation}</p>
                </div>
              </div>
            </div>

            {/* Side Cutouts */}
            <div className="absolute -left-4 bottom-[-16px] w-8 h-8 bg-slate-50 rounded-full z-10" />
            <div className="absolute -right-4 bottom-[-16px] w-8 h-8 bg-slate-50 rounded-full z-10" />
          </div>

          {/* QR Section */}
          <div className="bg-white p-6 pt-8 text-center relative">
            <div
              className="bg-slate-900 p-4 rounded-lg inline-block mb-4 shadow-lg relative"
            >
              <div className="bg-white p-3 rounded relative">
                <QrCode size={140} className="text-slate-900" />
              </div>
            </div>

            <div className="flex flex-col items-center gap-1 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{order.status}</span>
                </div>
                {order.scheduled_time && (
                  <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
                    <Clock size={12} />
                    <span className="text-xs font-bold uppercase tracking-wider">{order.scheduled_time}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 opacity-40">
                <div className="h-px w-8 bg-slate-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Scan Me</span>
                <div className="h-px w-8 bg-slate-400" />
              </div>
              <p className="text-2xl font-bold text-slate-900 tracking-wider">{order.id}</p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex items-center justify-between">
              <div className="text-left">
                <p className="text-xs font-bold text-orange-600 uppercase tracking-wider leading-none mb-1">Pay at counter</p>
                <p className="text-lg font-bold text-orange-700 leading-none">Total Payment</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-900 leading-none">₹{order.totalPrice.toFixed(2)}</p>
              </div>
            </div>

            <p className="mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Validated by Campus Management</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <button
          onClick={downloadTicket}
          className="w-full py-3 bg-white border border-dashed border-slate-200 text-slate-500 font-semibold rounded-lg hover:border-orange-300 hover:text-orange-600 transition-colors flex items-center justify-center gap-2"
        >
          <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center">
            <Download size={16} />
          </div>
          <span>Download Token PDF</span>
        </button>
      </div>
    </div>
  );
};

export default OrderTicket;

