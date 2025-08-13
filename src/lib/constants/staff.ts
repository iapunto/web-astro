export interface StaffMember {
  email: string;
  displayName: string;
  role?: string;
}

export const IA_PUNTO_STAFF: StaffMember[] = [
  {
    email: 'marilyn.cardozo@iapunto.com',
    displayName: 'Marilyn Cardozo',
    role: 'CTO & Desarrolladora',
  },
  {
    email: 'maria.rondon@iapunto.com',
    displayName: 'María Alejandra Rondón',
    role: 'Marketing & Comunicaciones',
  },
  {
    email: 'maria.rojas@iapunto.com',
    displayName: 'María Rojas de Rondón',
    role: 'Ventas & Clientes',
  },
  {
    email: 'sergio.rondon@iapunto.com',
    displayName: 'Sergio Rondón',
    role: 'CEO & Fundador',
  },
];

export const getStaffEmails = (): string[] => {
  return IA_PUNTO_STAFF.map((member) => member.email);
};

export const getStaffForCalendar = () => {
  return IA_PUNTO_STAFF.map((member) => ({
    email: member.email,
    displayName: member.displayName,
  }));
};
