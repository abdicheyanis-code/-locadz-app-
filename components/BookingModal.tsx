
import React, { useState, useMemo } from 'react';
import { Property, UserProfile, Booking } from '../types';
import { calculatePricing, createStripeCheckout } from '../services/stripeService';
import { bookingService } from '../services/bookingService';

interface BookingModalProps {
  property: Property;
  isOpen: boolean;
  currentUser: UserProfile | null;
  onClose: () => void;
  onOpenAuth: () => void;
  onBookingSuccess: () => void;
}

type BookingStep = 'DETAILS' | 'PAYMENT' | 'SUCCESS';

export const BookingModal: React.FC<BookingModalProps> = ({ 
  property, 
  isOpen, 
  currentUser,
  onClose,
  onOpenAuth,
  onBookingSuccess
}) => {
  const [step, setStep] = useState<BookingStep>('DETAILS');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nights = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = e.getTime() - s.getTime();
    const result = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return result > 0 ? result : 0;
  }, [startDate, endDate]);

  const pricing = calculatePricing(property.price, nights || 1);

  const handleStartPayment = async () => {
    if (!startDate || !endDate || nights <= 0) {
      setError("Veuillez sélectionner des dates valides.");
      return;
    }

    if (!bookingService.isRangeAvailable(property.id, new Date(startDate), new Date(endDate))) {
      setError("Désolé, ces dates ne sont plus disponibles.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    const stripeResult = await createStripeCheckout(property.id, pricing);
    
    if (stripeResult.success) {
      // Fix: Removed commission_fee as it is handled by the service internally to match Omit type definition
      const newBooking = await bookingService.createBooking({
        property_id: property.id,
        traveler_id: currentUser?.id || 'guest_user',
        start_date: startDate,
        end_date: endDate,
        total_price: pricing.total,
        payment_method: 'ON_ARRIVAL',
        payment_id: stripeResult.transactionId
      });

      if (newBooking) {
        setStep('SUCCESS');
        onBookingSuccess();
      }
    } else {
      setError("Le paiement a été refusé par la banque.");
    }
    setIsProcessing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-indigo-950/40 backdrop-blur-3xl animate-in fade-in duration-500 p-0 md:p-8">
      <div className="bg-white/95 backdrop-blur-md w-full max-w-6xl h-full md:h-auto md:max-h-[90vh] rounded-none md:rounded-[4rem] shadow-[0_50px_150px_rgba(0,0,0,0.4)] border-none md:border border-white/40 overflow-hidden flex flex-col md:flex-row relative">
        
        <button onClick={onClose} className="absolute top-8 right-8 z-50 bg-indigo-950/10 hover:bg-indigo-950/20 text-indigo-950 p-3 rounded-full backdrop-blur-xl transition-all active:scale-90">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div className="w-full md:w-3/5 h-64 md:h-auto relative overflow-hidden group">
          <img src={property.images[0]?.image_url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={property.title} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-12 left-12 text-white drop-shadow-2xl">
            <div className="flex gap-2 mb-4">
                <span className="bg-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Exclusivité LOCADZ</span>
                <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30">{property.category}</span>
            </div>
            <h2 className="text-5xl font-black italic tracking-tighter mb-2">{property.title}</h2>
            <p className="text-xl font-medium opacity-80">{property.location}</p>
          </div>
        </div>

        <div className="w-full md:w-2/5 flex flex-col p-10 bg-white relative overflow-y-auto no-scrollbar">
          
          {step === 'DETAILS' && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-6">À propos du séjour</h3>
                <p className="text-indigo-950 font-medium leading-relaxed italic text-lg">
                   "{property.description || "Un lieu d'exception conçu pour les voyageurs en quête de sérénité et de luxe absolu."}"
                </p>
                <div className="flex items-center gap-4 mt-8 pt-8 border-t border-indigo-50">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-xl shadow-inner">👤</div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hôte LOCADZ</p>
                        <p className="font-bold text-indigo-900">{property.hostName}</p>
                    </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Planifier votre arrivée</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-indigo-50/50 rounded-3xl border border-indigo-100">
                        <label className="text-[9px] font-black text-indigo-300 uppercase block mb-2">Arrivée</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-transparent font-bold text-indigo-950 outline-none" />
                    </div>
                    <div className="p-4 bg-indigo-50/50 rounded-3xl border border-indigo-100">
                        <label className="text-[9px] font-black text-indigo-300 uppercase block mb-2">Départ</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-transparent font-bold text-indigo-950 outline-none" />
                    </div>
                </div>
              </div>

              {nights > 0 && (
                <div className="p-8 bg-gradient-to-br from-indigo-900 to-violet-900 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                  <div className="relative z-10 space-y-3">
                    <div className="flex justify-between text-[10px] font-black opacity-60 uppercase">
                        <span>{nights} nuits x DA {property.price}</span>
                        <span>DA {pricing.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black opacity-60 uppercase">
                        <span>Frais de service (8%)</span>
                        <span>DA {pricing.commission.toFixed(0)}</span>
                    </div>
                    <div className="h-[1px] bg-white/10 my-4" />
                    <div className="flex justify-between items-end">
                        <span className="text-3xl font-black italic tracking-tighter">Total</span>
                        <span className="text-4xl font-black">DA {pricing.total.toFixed(0)}</span>
                    </div>
                  </div>
                  <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-40 group-hover:animate-shine" />
                </div>
              )}

              {error && <p className="text-rose-500 text-[10px] font-black uppercase text-center">{error}</p>}

              <button 
                onClick={handleStartPayment}
                disabled={isProcessing || nights <= 0}
                className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                ) : 'VÉRIFIER & RÉSERVER'}
              </button>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-700">
              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-200 mb-8 animate-bounce-slow">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
              </div>
              <h2 className="text-4xl font-black text-indigo-950 italic tracking-tighter mb-4">Voyage Confirmé</h2>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-10 px-6 leading-loose">
                Félicitations ! Votre demande de séjour à <span className="text-indigo-600">{property.location}</span> a été validée avec succès.
              </p>
              <div className="bg-indigo-50 p-6 rounded-3xl w-full text-left space-y-2 mb-10">
                <p className="text-[9px] font-black text-indigo-300 uppercase">Référence</p>
                <p className="text-sm font-bold text-indigo-900">#LCDZ-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
              </div>
              <button onClick={onClose} className="w-full py-5 border-2 border-indigo-600 text-indigo-600 rounded-full font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                VOIR MES VOYAGES
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
