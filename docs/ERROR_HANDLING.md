# Felhantering - Användarvänliga meddelanden

## Översikt

Alla tekniska felmeddelanden ska översättas till användarvänliga svenska meddelanden innan de visas för slutanvändare. Detta förbättrar användarupplevelsen och gör applikationen mer professionell.

## Användning

### Import

```typescript
import { showErrorToast } from "@/utils/errorMessages";
import { toast } from "sonner";
```

### Exempel

#### ❌ FEL - Visa tekniskt felmeddelande direkt
```typescript
try {
  // ... någon operation
} catch (error: any) {
  toast.error(error.message); // Visar "new row violates row-level security policy"
}
```

#### ✅ RÄTT - Använd showErrorToast
```typescript
try {
  // ... någon operation
} catch (error: any) {
  showErrorToast(toast, error, 'Kunde inte spara data');
}
```

### Parametrar

```typescript
showErrorToast(
  toast,              // Toast-instansen från sonner
  error,              // Felobjektet (any type)
  'Fallback-text'     // Valfri fallback-text om ingen matchning hittas
)
```

## Funktionalitet

Funktionen `getUserFriendlyError()` identifierar automatiskt följande typer av fel och översätter dem:

### Databasfel
- **RLS violations** → "Du har inte behörighet att utföra denna åtgärd"
- **Foreign key errors** → "Det gick inte att spara ändringarna"
- **Unique constraint** → "Den här informationen finns redan"

### Autentiseringsfel
- **Invalid credentials** → "Felaktig e-postadress eller lösenord"
- **User exists** → "Det finns redan ett konto med den här e-postadressen"
- **Token expired** → "Din session har gått ut. Logga in igen"

### Nätverksfel
- **Failed to fetch** → "Det gick inte att ansluta till servern"
- **Timeout** → "Åtgärden tog för lång tid"

### Valideringsfel
- **Invalid email** → "Ogiltig e-postadress"
- **Password too short** → "Lösenordet är för kort"
- **Required fields** → "Vänligen fyll i alla obligatoriska fält"

### Övriga fel
- **Permission denied** → "Du har inte behörighet att utföra denna åtgärd"
- **Not found** → "Det gick inte att hitta den begärda informationen"
- **Rate limit** → "För många försök. Vänta en stund"

## Debugging

Alla tekniska felmeddelanden loggas automatiskt i konsolen med `console.error()` för felsökning, så utvecklare kan fortfarande se de tekniska detaljerna.

```typescript
// I konsolen visas:
Technical error: new row violates row-level security policy for table "team_invitations"

// För användaren visas:
"Du har inte behörighet att bjuda in teammedlemmar. Kontakta din administratör."
```

## Best Practices

1. **Använd alltid showErrorToast** för alla felmeddelanden som visas för användare
2. **Lägg till beskrivande fallback-text** som är relevant för operationen
3. **Logga aldrig tekniska fel synligt för användare** i UI
4. **Konsollloggar finns kvar** för utvecklare att debugga med

## Komponenter som redan använder detta

- `TeamManagement.tsx`
- `AddInternalEventDialog.tsx`
- `Auth.tsx`
- `Admin.tsx`

## TODO för framtida utvecklare

När du skapar nya komponenter eller uppdaterar befintliga:

1. Importera `showErrorToast` från `@/utils/errorMessages`
2. Ersätt alla `toast.error(error.message)` med `showErrorToast(toast, error, 'Din text')`
3. Se till att fallback-texten är användarvänlig och på svenska
