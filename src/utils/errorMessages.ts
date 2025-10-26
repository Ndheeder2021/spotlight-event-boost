/**
 * Converts technical error messages to user-friendly Swedish messages
 * Logs technical details to console for debugging
 */
export function getUserFriendlyError(error: any): string {
  const errorMessage = error?.message || String(error);
  
  // Log technical error for debugging
  console.error('Technical error:', errorMessage, error);

  // Row Level Security errors
  if (errorMessage.includes('row-level security policy') || errorMessage.includes('violates row-level security')) {
    if (errorMessage.includes('team_invitations')) {
      return 'Du har inte behörighet att bjuda in teammedlemmar. Kontakta din administratör.';
    }
    if (errorMessage.includes('campaigns')) {
      return 'Du har inte behörighet att utföra denna åtgärd på kampanjer.';
    }
    if (errorMessage.includes('locations')) {
      return 'Du har inte behörighet att ändra platsinformation.';
    }
    return 'Du har inte behörighet att utföra denna åtgärd. Kontakta din administratör om du tror detta är ett misstag.';
  }

  // Foreign key constraint errors
  if (errorMessage.includes('foreign key constraint') || errorMessage.includes('violates foreign key')) {
    return 'Det gick inte att spara ändringarna. Viss information saknas eller är ogiltig.';
  }

  // Unique constraint errors
  if (errorMessage.includes('unique constraint') || errorMessage.includes('duplicate key')) {
    if (errorMessage.includes('email')) {
      return 'Den här e-postadressen används redan.';
    }
    return 'Den här informationen finns redan i systemet.';
  }

  // Network errors
  if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError') || errorMessage.includes('Network request failed')) {
    return 'Det gick inte att ansluta till servern. Kontrollera din internetanslutning och försök igen.';
  }

  // Timeout errors
  if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
    return 'Åtgärden tog för lång tid. Försök igen om ett ögonblick.';
  }

  // Authentication errors
  if (errorMessage.includes('Invalid login credentials') || errorMessage.includes('Invalid email or password')) {
    return 'Felaktig e-postadress eller lösenord. Försök igen.';
  }
  if (errorMessage.includes('User already registered') || errorMessage.includes('User already exists')) {
    return 'Det finns redan ett konto med den här e-postadressen.';
  }
  if (errorMessage.includes('Email not confirmed')) {
    return 'Du måste bekräfta din e-postadress innan du kan logga in.';
  }
  if (errorMessage.includes('Invalid token') || errorMessage.includes('Token expired')) {
    return 'Din session har gått ut. Logga in igen.';
  }

  // Validation errors
  if (errorMessage.includes('invalid') && errorMessage.includes('email')) {
    return 'Ogiltig e-postadress. Kontrollera formatet.';
  }
  if (errorMessage.includes('password') && (errorMessage.includes('too short') || errorMessage.includes('minimum'))) {
    return 'Lösenordet är för kort. Använd minst 6 tecken.';
  }
  if (errorMessage.includes('required') || errorMessage.includes('cannot be null')) {
    return 'Vänligen fyll i alla obligatoriska fält.';
  }

  // Rate limiting
  if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
    return 'För många försök. Vänta en stund och försök igen.';
  }

  // Permission errors
  if (errorMessage.includes('permission denied') || errorMessage.includes('not authorized') || errorMessage.includes('forbidden')) {
    return 'Du har inte behörighet att utföra denna åtgärd.';
  }

  // Not found errors
  if (errorMessage.includes('not found') || errorMessage.includes('does not exist')) {
    return 'Det gick inte att hitta den begärda informationen.';
  }

  // Database errors (generic)
  if (errorMessage.includes('database') || errorMessage.includes('postgres') || errorMessage.includes('sql')) {
    return 'Ett tekniskt fel uppstod. Försök igen om ett ögonblick.';
  }

  // Stripe/Payment errors
  if (errorMessage.includes('stripe') || errorMessage.includes('payment')) {
    return 'Ett fel uppstod med betalningen. Kontrollera dina uppgifter och försök igen.';
  }

  // File upload errors
  if (errorMessage.includes('file') && (errorMessage.includes('too large') || errorMessage.includes('size'))) {
    return 'Filen är för stor. Välj en mindre fil.';
  }
  if (errorMessage.includes('file type') || errorMessage.includes('invalid format')) {
    return 'Ogiltigt filformat. Välj en annan fil.';
  }

  // API errors (general)
  if (errorMessage.includes('API') || errorMessage.includes('service unavailable')) {
    return 'Tjänsten är tillfälligt otillgänglig. Försök igen om ett ögonblick.';
  }

  // If no specific match, return a generic friendly message
  // Don't expose raw technical errors to users
  if (errorMessage.length > 100 || 
      errorMessage.includes('function') || 
      errorMessage.includes('undefined') ||
      errorMessage.includes('null') ||
      errorMessage.includes('object') ||
      errorMessage.toLowerCase().includes('error:')) {
    return 'Ett oväntat fel uppstod. Om problemet kvarstår, kontakta support.';
  }

  // If it's a short, potentially user-written message, return it
  return errorMessage;
}

/**
 * Helper function to show error toast with user-friendly message
 */
export function showErrorToast(toast: any, error: any, fallbackMessage?: string) {
  const friendlyMessage = getUserFriendlyError(error);
  toast.error(fallbackMessage && friendlyMessage === error?.message ? fallbackMessage : friendlyMessage);
}
