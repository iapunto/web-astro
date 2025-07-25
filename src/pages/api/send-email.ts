import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { z } from 'zod';
import React from 'react';
import WelcomeMail from '../../components/emails/WelcomeMail.tsx';
import dotenv from 'dotenv';

dotenv.config();

const schema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio.'),
  email: z.string().email('Introduce un email válido.'),
  phone: z.string().min(1, 'Introduce un teléfono válido.'),
  company: z.string().optional(),
  message: z.string().min(1, 'El mensaje es obligatorio.'),
  'g-recaptcha-response': z
    .string()
    .min(1, 'El token de reCAPTCHA es obligatorio.'),
});

const resend = new Resend(process.env.RESEND_API_KEY);

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return false;
  const response = await fetch(
    'https://www.google.com/recaptcha/api/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret,
        response: token,
      }).toString(),
    }
  );
  const data = await response.json();
  return data.success && data.score && data.score > 0.5;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const validationResult = schema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((error) => ({
        path: error.path.join('.'),
        message: error.message,
      }));
      return new Response(
        JSON.stringify({
          error: 'Datos de formulario inválidos',
          details: errors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = validationResult.data;

    // Validar reCAPTCHA
    const recaptchaToken = data['g-recaptcha-response'];
    const recaptchaOk = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaOk) {
      return new Response(
        JSON.stringify({
          error: 'Fallo la verificación de reCAPTCHA. Intenta de nuevo.',
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const text = `
      Nombre: ${data.name}
      Email: ${data.email}
      Teléfono: ${data.phone}
      ${data.company ? `Empresa: ${data.company}` : ''}
      Mensaje: ${data.message}
      `;

    const html = `
      <p>Nombre: ${data.name}</p>
      <p>Email: ${data.email}</p>
      <p>Teléfono: ${data.phone}</p>
      ${data.company ? `<p>Empresa: ${data.company}</p>` : ''}
      <p>Mensaje: ${data.message}</p>
    `;

    // Enviar email de bienvenida al usuario
    let welcomeEmailResponse = null;
    let welcomeEmailError = null;
    try {
      welcomeEmailResponse = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'desarrollo@iapunto.com',
        to: data.email,
        subject: 'Bienvenido a IA Punto',
        react: React.createElement(WelcomeMail),
      });
    } catch (err) {
      welcomeEmailError = err instanceof Error ? err.message : String(err);
    }

    // Enviar notificación al equipo
    let notificationEmailResponse = null;
    let notificationEmailError = null;
    try {
      notificationEmailResponse = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'desarrollo@iapunto.com',
        to: process.env.EMAIL_TO || 'hola@iapunto.com',
        subject: 'Nuevo mensaje del formulario de contacto',
        html: html,
        text: text,
      });
    } catch (err) {
      notificationEmailError = err instanceof Error ? err.message : String(err);
    }

    // Si hay error en alguno de los envíos, devolver el error exacto
    if (welcomeEmailError || notificationEmailError) {
      return new Response(
        JSON.stringify({
          error: 'Error al enviar uno o ambos correos',
          welcomeEmailError,
          welcomeEmailResponse,
          notificationEmailError,
          notificationEmailResponse,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: 'Mensaje enviado con éxito',
        welcomeEmailResponse,
        notificationEmailResponse,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error al enviar el correo con Resend:', error);
    return new Response(
      JSON.stringify({ error: 'Error al enviar el mensaje' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const prerender = false;
