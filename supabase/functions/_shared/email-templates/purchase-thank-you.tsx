import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Hr,
} from 'https://esm.sh/@react-email/components@0.0.15'
import * as React from 'npm:react@18.3.1'

interface PurchaseThankYouProps {
  name: string
  planName: string
  amount: string
  billingPeriod: string
  dashboardLink: string
}

export const PurchaseThankYou = ({
  name,
  planName,
  amount,
  billingPeriod,
  dashboardLink,
}: PurchaseThankYouProps) => (
  <Html>
    <Head />
    <Preview>Tack för ditt köp - {planName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Tack för ditt köp! 🎉</Heading>
        <Text style={text}>
          Hej {name},
        </Text>
        <Text style={text}>
          Vi bekräftar att din betalning har genomförts framgångsrikt. Du har nu full tillgång till alla funktioner i {planName}-planen.
        </Text>
        <Section style={orderDetails}>
          <Heading style={h2}>Orderdetaljer</Heading>
          <Hr style={hr} />
          <table style={table}>
            <tr>
              <td style={tableLabel}>Abonnemang:</td>
              <td style={tableValue}>{planName}</td>
            </tr>
            <tr>
              <td style={tableLabel}>Belopp:</td>
              <td style={tableValue}>{amount}</td>
            </tr>
            <tr>
              <td style={tableLabel}>Faktureringsperiod:</td>
              <td style={tableValue}>{billingPeriod}</td>
            </tr>
            <tr>
              <td style={tableLabel}>Provperiod:</td>
              <td style={tableValue}>14 dagar gratis</td>
            </tr>
          </table>
        </Section>
        <Text style={text}>
          Ditt abonnemang förnyas automatiskt efter provperioden. Du kan när som helst hantera eller avsluta ditt abonnemang i dina inställningar.
        </Text>
        <Section style={buttonContainer}>
          <Link
            href={dashboardLink}
            target="_blank"
            style={button}
          >
            Gå till Dashboard
          </Link>
        </Section>
        <Text style={footer}>
          Om du har några frågor om din betalning eller ditt abonnemang, kontakta oss på support@spotlightevents.online
        </Text>
        <Text style={footer}>
          För juridiska frågor: legal@spotlightevents.online
        </Text>
        <Text style={footer}>
          Med vänliga hälsningar,<br />
          Spotlight Events Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default PurchaseThankYou

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 48px',
}

const h2 = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 48px',
  marginBottom: '16px',
}

const orderDetails = {
  padding: '0 48px',
  margin: '24px 0',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '16px 0',
}

const table = {
  width: '100%',
  marginTop: '16px',
}

const tableLabel = {
  color: '#6B7280',
  fontSize: '14px',
  paddingBottom: '8px',
  fontWeight: '500',
}

const tableValue = {
  color: '#333',
  fontSize: '14px',
  paddingBottom: '8px',
  textAlign: 'right' as const,
}

const buttonContainer = {
  padding: '27px 48px',
}

const button = {
  backgroundColor: '#0066FF',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 20px',
}

const footer = {
  color: '#898989',
  fontSize: '14px',
  lineHeight: '22px',
  padding: '0 48px',
  marginTop: '12px',
}
