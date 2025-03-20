import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Link,
} from "@react-email/components";

interface EmailInvitationProps {
  invitationLink: string;
}

const EmailInvitation: React.FC<EmailInvitationProps> = ({
  invitationLink,
}) => {
  return (
    <Html>
      <Head />
      <Preview>Confirmez votre abonnement à notre newsletter</Preview>
      <Body className="bg-gray-100 text-gray-900">
        <Container className="bg-white rounded-lg shadow p-6">
          <Heading className="text-xl font-bold mb-4">
            Bienvenue dans notre newsletter !
          </Heading>
          <Text className="mb-4">Bonjour, merci de vous être inscrit !</Text>
          <Text className="mb-4">
            Veuillez confirmer votre abonnement en cliquant sur le lien
            ci-dessous :
          </Text>
          <Link href={invitationLink} className="text-blue-600 underline">
            Confirmer votre abonnement
          </Link>
          <Text className="mt-6 text-gray-600">
            Si vous ne vous êtes pas inscrit, veuillez ignorer cet email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailInvitation;
