import React, { useState, type FormEvent } from "react";
import { z } from "zod";
import PhoneInput from "react-phone-number-input";
import CountryCode from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

const schema = z.object({
  name: z.string().min(3, "El nombre es obligatorio"),
  email: z.string().email("Introduce un correo electrónico válido"),
  phone: z.string().min(10, "El número de teléfono es obligatorio"),
  company: z.string().optional(),
  message: z.string().min(10, "El mensaje es obligatorio"),
});

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [error, setError] = useState<{ [key in keyof FormData]?: string }>({});
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setError({ ...error, [event.target.name as keyof FormData]: undefined });
  };

  const handlePhoneChange = (phone: string | undefined) => {
    setFormData({ ...formData, phone: phone || "" }); // Maneja el caso undefined
    setError({ ...error, phone: undefined });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationResult = schema.safeParse(formData);

    if (!validationResult.success) {
      const newErrors: { [key in keyof FormData]?: string } = {};
      validationResult.error.errors.forEach((error) => {
        newErrors[error.path[0] as keyof FormData] = error.message;
      });
      setError(newErrors);
      setStatus("Por favor, corrige los errores del formulario.");
      return;
    }

    setStatus("Enviando...");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationResult.data),
      });

      if (response.ok) {
        setStatus(
          "Tu Mensaje se ha enviado con éxito. Pronto te estaremos contactando"
        );
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          message: "",
        });
        setError({});
      } else {
        const errorData = await response.json();
        setStatus(`Error: ${errorData.error || "Error al enviar el mensaje."}`);
      }
    } catch (error) {
      console.error("Error enviando el formulario:", error);
      setStatus(
        "Error al enviar el formulario. Por favor, inténtalo de nuevo más tarde."
      );
    }
  };

  const allowedCountries = [
    "CO",
    "VE",
    "PE",
    "CL",
    "AR",
    "EC",
    "PA",
    "MX",
    "ES",
    "US",
  ]; // Usa el tipo CountryCode[]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative z-0 w-full mb-6 group">
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#E51F52] focus:outline-none focus:ring-0 focus:border-[#E51F52] peer"
          placeholder=" "
          required
        />
        <label
          htmlFor="name"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#E51F52] peer-focus:dark:text-[#E51F52] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Nombre
        </label>
        {error.name && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">
            {error.name}
          </p>
        )}
      </div>
      <div className="relative z-0 w-full mb-6 group">
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#E51F52] focus:outline-none focus:ring-0 focus:border-[#E51F52] peer"
          placeholder=" "
          required
        />
        <label
          htmlFor="email"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#E51F52] peer-focus:dark:text-[#E51F52] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Correo electrónico
        </label>
        {error.email && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">
            {error.email}
          </p>
        )}
      </div>

      <div className="relative z-0 w-full mb-6 group">
        <PhoneInput
          placeholder="Introduce tu número de teléfono"
          defaultCountry="CO" // Código del país por defecto
          countryOptionsOrder={[
            "CO",
            "VE",
            "PE",
            "CL",
            "AR",
            "EC",
            "PA",
            "MX",
            "ES",
            "US",
          ]} // Opciones de país ordenados
          countries={[
            "CO",
            "VE",
            "PE",
            "CL",
            "AR",
            "EC",
            "PA",
            "MX",
            "ES",
            "US",
          ]} // Opciones de país
          value={formData.phone}
          onChange={(phone) =>
            handleChange({ target: { name: "phone", value: phone } } as any)
          } // Manejo del evento onChange
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#E51F52] focus:outline-none focus:ring-0 focus:border-[#E51F52] peer"
        />
        <label
          htmlFor="phone"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#E51F52] peer-focus:dark:text-[#E51F52] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Teléfono
        </label>
        {error.phone && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">
            {error.phone}
          </p>
        )}
      </div>

      <div className="relative z-0 w-full mb-6 group">
        <input
          type="text"
          name="company"
          id="company"
          value={formData.company}
          onChange={handleChange}
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#E51F52] focus:outline-none focus:ring-0 focus:border-[#E51F52] peer"
          placeholder=" "
        />
        <label
          htmlFor="company"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#E51F52] peer-focus:dark:text-[#E51F52] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Empresa (opcional)
        </label>
        {error.company && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">
            {error.company}
          </p>
        )}
      </div>
      <div className="relative z-0 w-full mb-6 group">
        <textarea
          name="message"
          id="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#E51F52] focus:outline-none focus:ring-0 focus:border-[#E51F52] peer"
          placeholder=" "
          required
        ></textarea>
        <label
          htmlFor="message"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#E51F52] peer-focus:dark:text-[#E51F52] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Mensaje
        </label>
        {error.message && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">
            {error.message}
          </p>
        )}
      </div>

      {status && (
        <div className="mt-4">
          <p
            className={
              status.startsWith("Error")
                ? "text-red-600 dark:text-red-500"
                : "text-green-600 dark:text-green-500"
            }
          >
            {status}
          </p>
        </div>
      )}

      <button
        type="submit"
        className="border-[#E51F52] text-[#E51F52] border-solid border px-10 py-3 rounded-full hover:bg-[#E51F52] hover:text-white transition-colors duration-300"
      >
        Enviar
      </button>
    </form>
  );
};

export default ContactForm;
