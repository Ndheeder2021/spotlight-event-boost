import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from "https://esm.sh/@react-email/components@0.0.15";
import * as React from "npm:react@18.3.1";

interface ReferralWelcomeProps {
  email: string;
  referralCode: string;
  referralLink: string;
  commissionRate: number;
}

export const ReferralWelcome = ({
  email,
  referralCode,
  referralLink,
  commissionRate,
}: ReferralWelcomeProps) => (
  <Html>
    <Head />
    <Preview>Välkommen till Spotlight Referral Program! Din unika länk är redo.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🎉 Välkommen till Spotlight Referral Program!</Heading>
        
        <Text style={text}>
          Tack för att du gick med i vårt referral-program! Vi är glada att ha dig med oss.
        </Text>

        <Section style={codeContainer}>
          <Text style={label}>Din unika referral-länk:</Text>
          <Link href={referralLink} style={linkStyle}>
            {referralLink}
          </Link>
        </Section>

        <Section style={infoBox}>
          <Text style={infoText}>
            <strong>Din referral-kod:</strong> {referralCode}
          </Text>
          <Text style={infoText}>
            <strong>Din provision:</strong> {commissionRate}% på alla betalande kunder
          </Text>
        </Section>

        <Hr style={hr} />

        <Heading style={h2}>Så här fungerar det:</Heading>
        
        <Section style={stepSection}>
          <Text style={stepTitle}>1. Dela din länk</Text>
          <Text style={stepText}>
            Kopiera din unika referral-länk och dela den med ditt nätverk via email, 
            sociala medier eller direkt med dina vänner och kollegor.
          </Text>
        </Section>

        <Section style={stepSection}>
          <Text style={stepTitle}>2. De registrerar sig</Text>
          <Text style={stepText}>
            När någon klickar på din länk och skapar ett konto, registreras de automatiskt 
            som din referral och du får provision.
          </Text>
        </Section>

        <Section style={stepSection}>
          <Text style={stepTitle}>3. Du tjänar pengar</Text>
          <Text style={stepText}>
            För varje betalande kund som kommer via din länk tjänar du {commissionRate}% i provision. 
            Du kan följa dina intäkter via din referral-panel.
          </Text>
        </Section>

        <Hr style={hr} />

        <Section style={ctaSection}>
          <Link href={referralLink} style={button}>
            Visa min referral-panel
          </Link>
        </Section>

        <Text style={footerText}>
          Har du frågor? Kontakta oss på{" "}
          <Link href="mailto:support@spotlightevents.online" style={footerLink}>
            support@spotlightevents.online
          </Link>
        </Text>

        <Text style={footer}>
          <Link href="https://spotlightevents.online" target="_blank" style={footerLink}>
            Spotlight Events
          </Link>
          {" "}- Smart event-driven marknadsföring för lokala företag
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ReferralWelcome;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0 40px",
  textAlign: "center" as const,
};

const h2 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "30px 0 20px",
  padding: "0 40px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  padding: "0 40px",
};

const codeContainer = {
  backgroundColor: "#f4f4f4",
  borderRadius: "8px",
  margin: "30px 40px",
  padding: "24px",
};

const label = {
  color: "#666",
  fontSize: "14px",
  fontWeight: "600",
  marginBottom: "8px",
};

const linkStyle = {
  color: "#2563eb",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  wordBreak: "break-all" as const,
};

const infoBox = {
  backgroundColor: "#eff6ff",
  borderLeft: "4px solid #2563eb",
  margin: "30px 40px",
  padding: "20px",
};

const infoText = {
  color: "#333",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "8px 0",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "30px 40px",
};

const stepSection = {
  padding: "0 40px",
  marginBottom: "20px",
};

const stepTitle = {
  color: "#2563eb",
  fontSize: "18px",
  fontWeight: "600",
  marginBottom: "8px",
};

const stepText = {
  color: "#555",
  fontSize: "15px",
  lineHeight: "24px",
  marginBottom: "0",
};

const ctaSection = {
  textAlign: "center" as const,
  margin: "40px 0",
};

const button = {
  backgroundColor: "#2563eb",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 40px",
};

const footerText = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "24px",
  textAlign: "center" as const,
  padding: "0 40px",
  marginTop: "30px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
  padding: "0 40px",
  marginTop: "12px",
};

const footerLink = {
  color: "#2563eb",
  textDecoration: "none",
};
