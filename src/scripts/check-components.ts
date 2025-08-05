import dotenv from 'dotenv';
dotenv.config();

class StrapiService {
  private apiUrl: string;
  private apiToken: string;

  constructor() {
    this.apiUrl = process.env.STRAPI_API_URL || 'https://strapi.iapunto.com';
    this.apiToken = process.env.STRAPI_API_TOKEN || '';
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.apiUrl}/api${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiToken}`,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error en petición:', error);
      throw error;
    }
  }

  async getComponents() {
    return await this.makeRequest('/content-type-builder/components');
  }

  async getSharedComponents() {
    return await this.makeRequest(
      '/content-type-builder/components?filters[category][$eq]=shared'
    );
  }
}

async function checkComponents() {
  console.log('🔍 Verificando componentes disponibles...');
  const strapiService = new StrapiService();

  try {
    console.log('\n📋 Todos los componentes:');
    const allComponents = await strapiService.getComponents();
    console.log(JSON.stringify(allComponents, null, 2));

    console.log('\n📋 Componentes compartidos:');
    const sharedComponents = await strapiService.getSharedComponents();
    console.log(JSON.stringify(sharedComponents, null, 2));
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkComponents();
