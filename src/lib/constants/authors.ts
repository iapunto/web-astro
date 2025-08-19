export interface Author {
  id: string;
  name: string;
  description: string;
  image: string;
  email?: string;
  bio?: string;
}

export const AUTHORS: Author[] = [
  {
    id: 'sergio-rondon',
    name: 'Sergio Rondón',
    description: 'CEO y Fundador de IA Punto.',
    image:
      'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/sergio_gdcaeh.png',
    email: 'sergio.rondon@iapunto.com',
    bio: 'Emprendedor tecnológico con más de 25 años de experiencia en transformación digital.',
  },
  {
    id: 'marilyn-cardozo',
    name: 'Marilyn Cardozo',
    description: 'Experta en Desarrollo Digital.',
    image:
      'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739923879/marilyn_s2mi4a.png',
    email: 'marilyn.cardozo@iapunto.com',
    bio: 'Especialista en estrategias digitales y automatización de procesos empresariales.',
  },
];

export const getAuthorById = (id: string): Author | undefined => {
  return AUTHORS.find((author) => author.id === id);
};

export const getDefaultAuthor = (): Author => {
  return AUTHORS[0]; // Sergio Rondón como autor por defecto
};
