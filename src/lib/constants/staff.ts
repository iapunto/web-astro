export interface StaffMember {
  email: string;
  displayName: string;
  role?: string;
}

export const IA_PUNTO_STAFF: StaffMember[] = [
  {
    email: 'carlos@iapunto.com',
    displayName: 'Carlos Monnery',
    role: 'CEO & Fundador',
  },
  {
    email: 'pedro@iapunto.com',
    displayName: 'Pedro Zambrano',
    role: 'CTO & Desarrollador',
  },
  {
    email: 'magnolia@iapunto.com',
    displayName: 'Magnolia García',
    role: 'Marketing & Comunicaciones',
  },
  {
    email: 'admin@iapunto.com',
    displayName: 'Admin IA Punto',
    role: 'Administración',
  },
];

export const getStaffEmails = (): string[] => {
  return IA_PUNTO_STAFF.map(member => member.email);
};

export const getStaffForCalendar = () => {
  return IA_PUNTO_STAFF.map(member => ({
    email: member.email,
    displayName: member.displayName,
  }));
};
