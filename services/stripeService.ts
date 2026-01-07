export const PLATFORM_CLIENT_FEE_RATE = 0.08;  // 8 % côté client
export const HOST_COMMISSION_RATE = 0.10;      // 10 % pris sur le prix hôte

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

/**
 * Calcule tous les montants pour une réservation selon le modèle LOCADZ
 */
export const calculatePricing = (pricePerNight: number, nights: number) => {
  const base = pricePerNight * nights; // base_price

  const serviceFeeClient = base * PLATFORM_CLIENT_FEE_RATE; // 8 % client
  const hostCommission = base * HOST_COMMISSION_RATE;       // 10 % hôte

  const totalClient = base + serviceFeeClient;              // ce que paie le client
  const payoutHost = base - hostCommission;                 // ce que tu verses à l’hôte

  const platformRevenue = serviceFeeClient + hostCommission; // ce que gagne LOCADZ

  return {
    base,               // base_price
    serviceFeeClient,   // 8 %
    hostCommission,     // 10 %
    totalClient,        // montant à payer par le client
    payoutHost,         // montant net dû à l’hôte
    platformRevenue,    // revenu total LOCADZ sur cette résa
  };
};

/**
 * Simule la confirmation d'une réservation avec "paiement local"
 */
export const createLocalPaymentSession = async (propertyId: string, pricing: any) => {
  console.log(
    `[LOCADZ Reserve] Confirmation de réservation pour ${propertyId}. Mode: paiement centralisé LOCADZ (simulé).`
  );
  
  return new Promise<{ success: boolean; transactionId: string }>((resolve) => {
    // Simulation d'un délai de traitement serveur local
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: `RES-DZ-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      });
    }, 1500);
  });
};

// Alias pour compatibilité descendante
export const createStripeCheckout = createLocalPaymentSession;
