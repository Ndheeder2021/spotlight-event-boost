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

interface VerificationEmailProps {
  verificationLink: string
  email: string
}

export const VerificationEmail = ({
  verificationLink,
  email,
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Verifiera din e-postadress för Spotlight Events</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Välkommen till Spotlight Events!</Heading>
        <Text style={text}>
          Tack för att du registrerade dig hos oss. För att komma igång behöver vi verifiera din e-postadress.
        </Text>
        <Section style={buttonContainer}>
          <Link
            href={verificationLink}
            target="_blank"
            style={button}
          >
            Verifiera e-postadress
          </Link>
        </Section>
        <Text style={text}>
          Eller kopiera och klistra in denna länk i din webbläsare:
        </Text>
        <Text style={link}>
          {verificationLink}
        </Text>
        <Text style={footer}>
          Om du inte skapade ett konto hos Spotlight Events kan du ignorera detta e-postmeddelande.
        </Text>
        <Text style={footer}>
          Med vänliga hälsningar,<br />
          Spotlight Events Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default VerificationEmail

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

const link = {
  color: '#0066FF',
  fontSize: '14px',
  padding: '0 48px',
  wordBreak: 'break-all' as const,
}

const footer = {
  color: '#898989',
  fontSize: '14px',
  lineHeight: '22px',
  padding: '0 48px',
  marginTop: '12px',
}
