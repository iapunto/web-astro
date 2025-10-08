import { StrapiService } from '../../../lib/strapi.js';

export async function GET() {
  const startTime = Date.now();
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    strapiConfig: {
      apiUrl: process.env.STRAPI_API_URL || 'https://strapi.iapunto.com',
      hasToken: !!process.env.STRAPI_API_TOKEN,
      tokenLength: process.env.STRAPI_API_TOKEN?.length || 0,
    },
    tests: {
      articles: { success: false, count: 0, error: null, responseTime: 0 },
      categories: { success: false, count: 0, error: null, responseTime: 0 },
      tags: { success: false, count: 0, error: null, responseTime: 0 },
    },
    summary: {
      totalTests: 3,
      passedTests: 0,
      failedTests: 0,
      overallSuccess: false,
    },
  };

  // Test 1: Articles
  try {
    const articlesStartTime = Date.now();
    const articles = await StrapiService.getArticles();
    const articlesResponseTime = Date.now() - articlesStartTime;
    
    diagnostics.tests.articles = {
      success: true,
      count: articles.length,
      error: null,
      responseTime: articlesResponseTime,
    };
    diagnostics.summary.passedTests++;
  } catch (error) {
    diagnostics.tests.articles = {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : String(error),
      responseTime: 0,
    };
    diagnostics.summary.failedTests++;
  }

  // Test 2: Categories
  try {
    const categoriesStartTime = Date.now();
    const categories = await StrapiService.getCategories();
    const categoriesResponseTime = Date.now() - categoriesStartTime;
    
    diagnostics.tests.categories = {
      success: true,
      count: categories.length,
      error: null,
      responseTime: categoriesResponseTime,
    };
    diagnostics.summary.passedTests++;
  } catch (error) {
    diagnostics.tests.categories = {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : String(error),
      responseTime: 0,
    };
    diagnostics.summary.failedTests++;
  }

  // Test 3: Tags
  try {
    const tagsStartTime = Date.now();
    const tags = await StrapiService.getTags();
    const tagsResponseTime = Date.now() - tagsStartTime;
    
    diagnostics.tests.tags = {
      success: true,
      count: tags.length,
      error: null,
      responseTime: tagsResponseTime,
    };
    diagnostics.summary.passedTests++;
  } catch (error) {
    diagnostics.tests.tags = {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : String(error),
      responseTime: 0,
    };
    diagnostics.summary.failedTests++;
  }

  // Calculate overall success
  diagnostics.summary.overallSuccess = diagnostics.summary.passedTests === diagnostics.summary.totalTests;
  const totalResponseTime = Date.now() - startTime;

  // Return diagnostics with appropriate status code
  const status = diagnostics.summary.overallSuccess ? 200 : 503;
  
  return new Response(JSON.stringify({
    ...diagnostics,
    responseTime: totalResponseTime,
    status: diagnostics.summary.overallSuccess ? 'OK' : 'ERROR',
  }, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
