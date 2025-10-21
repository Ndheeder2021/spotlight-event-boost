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

interface ContactThankYouProps {
  name: string
  subject: string
}

export const ContactThankYou = ({
  name,
  subject,
}: ContactThankYouProps) => (
  <Html>
    <Head />
    <Preview>Tack för ditt meddelande - Spotlight Events</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Tack för ditt meddelande! 📧</Heading>
        <Text style={text}>
          Hej {name},
        </Text>
        <Text style={text}>
          Vi har tagit emot ditt meddelande angående "{subject}" och uppskattar att du hörde av dig till oss.
        </Text>
        <Text style={text}>
          Vårt team kommer att granska ditt meddelande och återkomma till dig inom 24-48 timmar. Vi strävar alltid efter att ge dig bästa möjliga support och service.
        </Text>
        <Section style={infoBox}>
          <Text style={infoText}>
            <strong>Vanliga svarstider:</strong><br />
            Vardagar: 9:00 - 17:00 CET<br />
            Helger: Inom 48 timmar
          </Text>
        </Section>
        <Text style={text}>
          Under tiden kan du:
        </Text>
        <ul style={list}>
          <li style={listItem}>
            <Link href="https://spotlightevents.online/how-it-works" style={link}>
              Läs mer om hur Spotlight Events fungerar
            </Link>
          </li>
          <li style={listItem}>
            <Link href="https://spotlightevents.online/blog" style={link}>
              Utforska våra marknadsföringsguider
            </Link>
          </li>
          <li style={listItem}>
            <Link href="https://spotlightevents.online/pricing" style={link}>
              Se våra prisplaner
            </Link>
          </li>
        </ul>
        <Text style={footer}>
          För brådskande frågor, kontakta oss direkt på support@spotlightevents.online
        </Text>
        <Text style={footer}>
          Med vänliga hälsningar,<br />
          Spotlight Events Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ContactThankYou

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

const infoBox = {
  backgroundColor: '#f0f9ff',
  borderLeft: '4px solid #0066FF',
  margin: '24px 48px',
  padding: '16px',
}

const infoText = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
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

const link = {
  color: '#0066FF',
  textDecoration: 'underline',
}

const footer = {
  color: '#898989',
  fontSize: '14px',
  lineHeight: '22px',
  padding: '0 48px',
  marginTop: '12px',
}
