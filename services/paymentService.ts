import { supabase } from '../supabaseClient';
import { PaymentMethod, PaymentProof } from '../types';
import { authService } from './authService';

interface UploadPaymentProofOptions {
  userId: string;
  bookingId: string;
  amount: number;
  paymentMethod: PaymentMethod; // 'ON_ARRIVAL' | 'BARIDIMOB' | 'RIB'
  file: File;
}

export const paymentService = {
  /**
   * Upload une preuve de paiement (image / PDF) et crée une ligne dans payment_proofs.
   * Retourne l'id de la preuve créée ou une erreur.
   */
  uploadPaymentProof: async (
    options: UploadPaymentProofOptions
  ): Promise<{ proofId: string | null; error: string | null }> => {
    const { userId, bookingId, amount, paymentMethod, file } = options;

    try {
      // 1) Préparer le chemin dans le bucket storage
      const fileExt = file.name.split('.').pop();
      const safeExt = fileExt ? fileExt.toLowerCase() : 'dat';
      const fileName = `${bookingId}-${Date.now()}.${safeExt}`;
      const filePath = `proofs/${bookingId}/${fileName}`;

      // 2) Uploader le fichier dans le bucket "payment-proofs"
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, file);

      if (uploadError || !uploadData) {
        console.error('Upload payment proof error:', uploadError);
        return { proofId: null, error: 'UPLOAD_FAILED' };
      }

      // 3) Récupérer une URL publique
      const { data: publicUrlData } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(uploadData.path);

      const proofUrl = publicUrlData.publicUrl;

      // 4) Créer la ligne dans payment_proofs
      const { data: proofRows, error: insertError } = await supabase
        .from('payment_proofs')
        .insert([
          {
            booking_id: bookingId,
            user_id: userId,
            amount,
            payment_method: paymentMethod,
            proof_url: proofUrl,
          },
        ])
        .select('id')
        .single();

      if (insertError || !proofRows) {
        console.error('Insert payment_proofs error:', insertError);
        return { proofId: null, error: 'INSERT_FAILED' };
      }

      return { proofId: proofRows.id as string, error: null };
    } catch (e) {
      console.error('Unexpected payment proof error:', e);
      return { proofId: null, error: 'UNKNOWN_ERROR' };
    }
  },

  /**
   * ADMIN : liste des preuves de paiement en attente de validation
   */
  getPendingProofsForAdmin: async (): Promise<PaymentProof[]> => {
    const admin = authService.getSession();
    if (!admin || admin.role !== 'ADMIN') {
      return [];
    }

    const { data, error } = await supabase
      .from('payment_proofs')
      .select('*')
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getPendingProofsForAdmin error:', error);
      return [];
    }

    return (data as PaymentProof[]) || [];
  },

  /**
   * ADMIN : valider ou rejeter une preuve de paiement
   * - approve = true  -> status = APPROVED + booking -> PAID
   * - approve = false -> status = REJECTED + raison optionnelle
   */
  reviewPaymentProof: async (params: {
    proofId: string;
    approve: boolean;
    rejectionReason?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const { proofId, approve, rejectionReason } = params;

    const admin = authService.getSession();
    if (!admin || admin.role !== 'ADMIN') {
      return { success: false, error: 'UNAUTHORIZED' };
    }

    try {
      // 1) Récupérer la preuve pour connaître booking_id
      const { data: proof, error: proofError } = await supabase
        .from('payment_proofs')
        .select('booking_id')
        .eq('id', proofId)
        .maybeSingle();

      if (proofError || !proof) {
        console.error('reviewPaymentProof: proof not found', proofError);
        return { success: false, error: 'PROOF_NOT_FOUND' };
      }

      const now = new Date().toISOString();
      const newStatus = approve ? 'APPROVED' : 'REJECTED';

      // 2) Mettre à jour la preuve
      const { error: updateProofError } = await supabase
        .from('payment_proofs')
        .update({
          status: newStatus,
          reviewed_by: admin.id,
          reviewed_at: now,
          rejection_reason: approve ? null : rejectionReason || null,
        })
        .eq('id', proofId);

      if (updateProofError) {
        console.error('reviewPaymentProof: update proof error', updateProofError);
        return { success: false, error: 'UPDATE_FAILED' };
      }

      // 3) Si approuvé, marquer la réservation comme PAYÉE
      if (approve) {
        const { error: bookingError } = await supabase
          .from('bookings')
          .update({ status: 'PAID' })
          .eq('id', proof.booking_id);

        if (bookingError) {
          console.error('reviewPaymentProof: update booking error', bookingError);
          return { success: false, error: 'BOOKING_UPDATE_FAILED' };
        }
      }

      return { success: true };
    } catch (e) {
      console.error('Unexpected reviewPaymentProof error:', e);
      return { success: false, error: 'UNKNOWN_ERROR' };
    }
  },
};
