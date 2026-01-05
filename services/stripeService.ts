export const PLATFORM_COMMISSION_RATE = 0.08; // Commission de service locale 8%

/**
 * Formate le prix selon les standards algériens (DA)
 */
export const formatCurrency = (amount: number) => {
  const formatted = new Intl.NumberFormat('fr-DZ', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  
  return formatted + ' DA';
};

export const calculatePricing = (pricePerNight: number, nights: number) => {
  const subtotal = pricePerNight * nights;
  const commission = subtotal * PLATFORM_COMMISSION_RATE;
  const total = subtotal + commission;
  
  return {
    subtotal,
    commission,
    total
  };
};

/**
 * Simule la confirmation d'une réservation avec paiement à l'arrivée
 */
export const createLocalPaymentSession = async (propertyId: string, pricing: any) => {
  console.log(`[LOCADZ Reserve] Confirmation de réservation pour ${propertyId}. Mode: Paiement à l'arrivée.`);
  
  return new Promise<{success: boolean, transactionId: string}>((resolve) => {
    // Simulation d'un délai de traitement serveur local
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: `RES-DZ-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      });
    }, 1500);
  });
};

// Alias pour compatibilité descendante
export const createStripeCheckout = createLocalPaymentSession;