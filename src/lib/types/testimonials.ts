export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  image: string;
  position: string;
  company: string;
  imageType?: 'avatar' | 'logo' | 'icono';
}

export interface CompanyLogo {
  id: number;
  name: string;
  logoUrl: string;
  website: string;
}
