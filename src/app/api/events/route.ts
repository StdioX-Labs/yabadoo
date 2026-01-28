import { NextResponse } from 'next/server';

// The base URL for the events API
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.soldoutafrica.com/api/v1';

// API Authentication
const API_USERNAME = process.env.API_USERNAME || '254717286026';
const API_PASSWORD = process.env.API_PASSWORD || 's0ascAnn3r@56YearsLater!';

// Enable mock data fallback for testing
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

// Create Basic Auth header
const createAuthHeader = () => {
  const credentials = Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString('base64');
  return `Basic ${credentials}`;
};

interface EventFromAPI {
  id: number;
  eventName: string;
  eventDescription: string;
  eventPosterUrl: string;
  eventCategoryId: number;
  ticketSaleStartDate: string;
  ticketSaleEndDate: string;
  eventLocation: string;
  eventStartDate: string;
  eventEndDate: string;
  isActive: boolean;
  tickets: Array<{
    id: number;
    ticketName: string;
    ticketPrice: number;
    quantityAvailable: number;
    soldQuantity: number;
    isActive: boolean;
    isSoldOut: boolean;
  }>;
  createdById: number;
  companyId: number;
  companyName: string;
  category: string;
  date: string;
  time: string;
  isFeatured: boolean;
  price: number;
  slug: string;
  currency: string;
}

interface APIResponse {
  message: string;
  events: EventFromAPI[];
  status: boolean;
}

// Mock data for testing when external API is not available
const MOCK_EVENTS: EventFromAPI[] = [
  {
    id: 145,
    eventName: "The Fun Club",
    eventDescription: "Barbecue, cocktails, live music + dj, hiking + bonfire",
    eventPosterUrl: "https://i.ibb.co/4ww37g86/Whats-App-Image-2026-01-16-at-5-19-52-PM.jpg",
    eventCategoryId: 17,
    ticketSaleStartDate: "2026-01-17T18:22:34Z",
    ticketSaleEndDate: "2026-04-06T18:22:22Z",
    eventLocation: "Gatamaiyu Forest",
    eventStartDate: "2026-04-04T06:30:04Z",
    eventEndDate: "2026-04-05T19:30:45Z",
    isActive: true,
    tickets: [
      {
        id: 456,
        ticketName: "Pass",
        ticketPrice: 6500.00,
        quantityAvailable: 300,
        soldQuantity: 0,
        isActive: true,
        isSoldOut: false,
      }
    ],
    createdById: 3,
    companyId: 3,
    companyName: "PRINCE YABA",
    category: "Adventure & Outdoor Events",
    date: "Apr 04, 2026",
    time: "09:30 AM",
    isFeatured: false,
    price: 6500.00,
    slug: "fun-club",
    currency: "KES"
  },
  {
    id: 162,
    eventName: "Rhumbacane Nights",
    eventDescription: "Rhumbacane Nights - Experience the best of latin music",
    eventPosterUrl: "https://eu2.contabostorage.com/b418dbb4d7c942e5b311c172a41d1db8:bv-kenya/events/1769430100792-o51k0c6.png",
    eventCategoryId: 1,
    ticketSaleStartDate: "2026-01-24T21:00:00Z",
    ticketSaleEndDate: "2026-02-28T21:00:00Z",
    eventLocation: "Vibanda Village",
    eventStartDate: "2026-02-28T16:00:00Z",
    eventEndDate: "2026-02-07T19:00:00Z",
    isActive: true,
    tickets: [
      {
        id: 472,
        ticketName: "Early Bird",
        ticketPrice: 1000.00,
        quantityAvailable: 1000,
        soldQuantity: 0,
        isActive: true,
        isSoldOut: false,
      },
      {
        id: 473,
        ticketName: "Advance",
        ticketPrice: 1500.00,
        quantityAvailable: 1000,
        soldQuantity: 0,
        isActive: true,
        isSoldOut: false,
      }
    ],
    createdById: 2,
    companyId: 3,
    companyName: "PRINCE YABA",
    category: "Music Events",
    date: "Feb 28, 2026",
    time: "07:00 PM",
    isFeatured: false,
    price: 1000.00,
    slug: "rhumbacane-nights",
    currency: "KES"
  }
];

export async function GET() {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // If mock data is enabled, return it immediately
  if (USE_MOCK_DATA) {
    console.log('🎭 Using mock data (USE_MOCK_DATA=true)');
    return NextResponse.json({
      success: true,
      events: MOCK_EVENTS,
      count: MOCK_EVENTS.length,
      source: 'mock',
    }, { headers });
  }

  const endpoint = `${BASE_URL}/company/events/get`;

  try {
    console.log('🔄 Fetching events from:', endpoint);
    console.log('🔐 Using Basic Auth for user:', API_USERNAME);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': createAuthHeader(),
      },
      cache: 'no-store',
    });

    console.log('📡 API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API response not OK:', response.status, response.statusText);
      console.error('Error details:', errorText);

      // Fallback to mock data if API fails
      console.warn('⚠️ Falling back to mock data due to API error');
      return NextResponse.json({
        success: true,
        events: MOCK_EVENTS,
        count: MOCK_EVENTS.length,
        source: 'mock-fallback',
        warning: `API returned ${response.status}. Using mock data.`,
      }, { headers });
    }

    const data = await response.json() as APIResponse;
    console.log('✅ Successfully fetched events:', data.events?.length || 0);

    // Filter events for company ID 3 (PRINCE YABA) and only active events
    const filteredEvents = data.events?.filter(
      (event: EventFromAPI) => event.companyId === 3 && event.isActive === true
    ) || [];

    console.log('🎯 Filtered events (Company ID 3, Active):', filteredEvents.length);

    return NextResponse.json({
      success: true,
      events: filteredEvents,
      count: filteredEvents.length,
      source: 'api',
    }, { headers });

  } catch (error) {
    console.error('💥 Error fetching events:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn('⚠️ Falling back to mock data due to error:', errorMessage);

    // Fallback to mock data
    return NextResponse.json({
      success: true,
      events: MOCK_EVENTS,
      count: MOCK_EVENTS.length,
      source: 'mock-fallback',
      warning: 'Using mock data due to API error',
      error: errorMessage,
    }, { headers });
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

