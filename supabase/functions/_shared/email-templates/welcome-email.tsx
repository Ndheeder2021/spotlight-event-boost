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
} from 'https://esm.sh/@react-email/components@0.0.15'
import * as React from 'npm:react@18.3.1'

interface WelcomeEmailProps {
  name: string
  dashboardLink: string
}

export const WelcomeEmail = ({
  name,
  dashboardLink,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Välkommen till Spotlight Events - Din e-post är verifierad!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>E-posten är verifierad! 🎉</Heading>
        <Text style={text}>
          Hej {name},
        </Text>
        <Text style={text}>
          Tack för att du verifierade din e-postadress! Nu är du redo att upptäcka alla spännande evenemang i din närhet och skapa kraftfulla marknadsföringskampanjer.
        </Text>
        <Text style={text}>
          Med Spotlight Events kan du:
        </Text>
        <ul style={list}>
          <li style={listItem}>Hitta relevanta evenemang nära din verksamhet</li>
          <li style={listItem}>Skapa AI-drivna marknadsföringskampanjer</li>
          <li style={listItem}>Analysera kampanjresultat i realtid</li>
          <li style={listItem}>Maximera din marknadsförings-ROI</li>
        </ul>
        <Section style={buttonContainer}>
          <Link
            href={dashboardLink}
            target="_blank"
            style={button}
          >
            Kom igång nu
          </Link>
        </Section>
        <Text style={footer}>
          Behöver du hjälp? Kontakta oss på support@spotlightevents.online
        </Text>
        <Text style={footer}>
          Med vänliga hälsningar,<br />
          Spotlight Events Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

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

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 48px',
  marginBottom: '16px',
}

const list = {
  padding: '0 48px',
  margin: '16px 0',
}

const listItem = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  marginBottom: '8px',
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
