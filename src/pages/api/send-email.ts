import type { APIRoute } from "astro";
import { Resend } from "resend";
import { z } from "zod";
import WelcomeMail from "../../components/emails/WelcomeMail";
import dotenv from "dotenv";

dotenv.config();

const schema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  email: z.string().email("Introduce un email válido."),
  phone: z.string().min(1, "Introduce un teléfono válido."),
  company: z.string().optional(),
  message: z.string().min(1, "El mensaje es obligatorio."),
});

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const validationResult = schema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((error) => ({
        path: error.path.join("."),
        message: error.message,
      }));
      return new Response(
        JSON.stringify({
          error: "Datos de formulario inválidos",
          details: errors,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = validationResult.data;

    const text = `
      Nombre: ${data.name}
      Email: ${data.email}
      Teléfono: ${data.phone}
      ${data.company ? `Empresa: ${data.company}` : ""}
      Mensaje: ${data.message}
      `;

    const html = `
      <p>Nombre: ${data.name}</p>
      <p>Email: ${data.email}</p>
      <p>Teléfono: ${data.phone}</p>
      ${data.company ? `<p>Empresa: ${data.company}</p>` : ""}
      <p>Mensaje: ${data.message}</p>
    `;

    const WelcomeHtml = WelcomeMail;

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "desarrollo@iapunto.com",
      to: data.email,
      subject: "Bienvenido a IA Punto",
      react: WelcomeHtml(),
    });

    const emailResponse = await resend.emails.send({
      from: process.env.EMAIL_FROM || "desarrollo@iapunto.com",
      to: process.env.EMAIL_TO || "hola@iapunto.com",
      subject: "Nuevo mensaje del formulario de contacto",
      html: html,
      text: text,
    });

    return new Response(
      JSON.stringify({ message: "Mensaje enviado con éxito", emailResponse }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error al enviar el correo con Resend:", error);
    return new Response(
      JSON.stringify({ error: "Error al enviar el mensaje" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const prerender = false;
