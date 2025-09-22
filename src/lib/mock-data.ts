import { UserDto, PropertyDto } from '@/contracts';

// =================================
// In-Memory Database Store
// =================================

interface MockDb {
  // We add passwordHash here for the mock login simulation
  users: (UserDto & { passwordHash: string })[];
  properties: PropertyDto[];
}

// In a real app, this would be a database connection.
// We use a global variable to simulate a persistent in-memory DB across hot reloads in dev.
declare global {
  var mockDb: MockDb | undefined;
}

const mockDb: MockDb = global.mockDb ?? {
  users: [
    {
      user_id: 1,
      email: 'jules@example.com',
      passwordHash: '$2b$10$faker.password.hash.for.jules', // Fake bcrypt hash
      first_name: 'Jules',
      last_name: 'Dev',
      email_verified: true,
      is_active: true,
      account_status: 'active',
      created_at: '2023-01-15T10:00:00Z',
      updated_at: '2023-01-15T10:00:00Z',
    },
  ],
  properties: [
    {
      property_id: 101,
      owner_id: 1,
      property_name: 'My Primary Residence',
      property_type: 'house',
      bedrooms: 4,
      bathrooms: 3,
      purchase_price: 500000,
      purchase_date: '2020-08-20',
      is_primary_residence: true,
      is_rental: false,
      status: 'active',
      address: {
        address_id: 201,
        property_id: 101,
        address_line_1: '123 Main Street',
        city: 'Metropolis',
        county: 'Central County',
        postcode: 'MC1 2AB',
        country: 'UK',
      },
      created_at: '2023-01-16T11:00:00Z',
      updated_at: '2023-01-16T11:00:00Z',
    },
    {
      property_id: 102,
      owner_id: 1,
      property_name: 'Downtown Flat',
      property_type: 'flat',
      bedrooms: 1,
      bathrooms: 1,
      purchase_price: 250000,
      purchase_date: '2022-03-10',
      is_primary_residence: false,
      is_rental: true,
      status: 'active',
      address: {
        address_id: 202,
        property_id: 102,
        address_line_1: '456 High Street, Apt 5B',
        city: 'Metropolis',
        county: 'Central County',
        postcode: 'MC2 3CD',
        country: 'UK',
      },
      created_at: '2023-01-17T12:00:00Z',
      updated_at: '2023-01-17T12:00:00Z',
    },
  ],
};

if (process.env.NODE_ENV !== 'production') {
  global.mockDb = mockDb;
}

export default mockDb;
