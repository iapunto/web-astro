import * as React from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";

export function WelcomeEmail() {
  return (
    <Html>
      <Head />
      <Preview>Bienvenido a nuestra comunidad</Preview>
      <Body
        style={{
          backgroundColor: "#ffffff",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        }}
      >
        <Container
          style={{ margin: "0 auto", maxWidth: "600px", padding: "20px" }}
        >
          <Text
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            ¡Bienvenido!
          </Text>
          <Text
            style={{
              fontSize: "16px",
              lineHeight: "1.5",
              marginBottom: "20px",
            }}
          >
            Gracias por contactarnos. Nos complace tenerte en nuestra comunidad.
          </Text>
          <Text
            style={{
              fontSize: "16px",
              lineHeight: "1.5",
              marginBottom: "20px",
            }}
          >
            Aquí tienes algunos recursos útiles:
          </Text>
          <Link
            href="https://tu-sitio-web.com"
            style={{
              fontSize: "16px",
              color: "#007bff",
              textDecoration: "none",
            }}
          >
            Visita nuestro sitio web
          </Link>
          <Text style={{ fontSize: "14px", color: "#888", marginTop: "20px" }}>
            Si tienes alguna pregunta, no dudes en contactarnos.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default WelcomeEmail;
