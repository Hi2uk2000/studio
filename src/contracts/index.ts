// src/contracts/index.ts

// =================================
// Base & Generic Types
// =================================

export type DbId = number;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

// =================================
// Authentication
// =================================

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  user: UserDto;
}

export interface RegisterDto {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
}

// =================================
// User
// =================================

export interface UserDto {
  user_id: DbId;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  email_verified: boolean;
  is_active: boolean;
  account_status: 'active' | 'suspended' | 'deleted';
  timezone?: string;
  last_login?: string; // ISO 8601 date string
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
}

export interface UpdateUserDto {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  timezone?: string;
}

export interface UserPreferencesDto {
  preference_id: DbId;
  user_id: DbId;
  theme: 'light' | 'dark' | 'auto';
  default_view: 'dashboard' | 'properties' | 'tasks';
  language: string;
  currency: string;
  date_format: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  notifications_enabled: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  maintenance_alerts: boolean;
  warranty_alerts: boolean;
  renewal_alerts: boolean;
}

export type UpdateUserPreferencesDto = Partial<Omit<UserPreferencesDto, 'preference_id' | 'user_id'>>;


// =================================
// Property
// =================================

export interface PropertyAddressDto {
  address_id: DbId;
  property_id: DbId;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
}

export interface PropertyDto {
  property_id: DbId;
  owner_id: DbId;
  property_name?: string;
  property_type: 'house' | 'flat' | 'apartment' | 'bungalow' | 'other';
  bedrooms: number;
  bathrooms: number;
  size_sqft?: number;
  purchase_price: number;
  purchase_date: string; // ISO 8601 date string
  current_market_value?: number;
  is_primary_residence: boolean;
  is_rental: boolean;
  status: 'active' | 'archived' | 'sold';
  address: PropertyAddressDto; // Nested address
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
}

export type CreatePropertyDto = Omit<PropertyDto, 'property_id' | 'owner_id' | 'created_at' | 'updated_at' | 'address'> & {
  address: Omit<PropertyAddressDto, 'address_id' | 'property_id'>;
};

export type UpdatePropertyDto = Partial<CreatePropertyDto>;


// =================================
// Asset
// =================================

export interface AssetDto {
    asset_id: DbId;
    property_id: DbId;
    user_id: DbId;
    category_id: DbId;
    name: string;
    brand?: string;
    model_number?: string;
    serial_number?: string;
    location: string;
    condition: 'excellent' | 'good' | 'fair' | 'poor' | 'needs_repair';
    purchase_price?: number;
    current_value?: number;
    purchase_date?: string; // ISO 8601 date string
    warranty_expiry_date?: string; // ISO 8601 date string
    next_maintenance_date?: string; // ISO 8601 date string
    maintenance_frequency?: 'weekly' | 'monthly' | 'quarterly' | 'biannually' | 'annually';
    is_active: boolean;
    created_at: string; // ISO 8601 date string
    updated_at: string; // ISO 8601 date string
}

export type CreateAssetDto = Omit<AssetDto, 'asset_id' | 'user_id' | 'created_at' | 'updated_at'>;
export type UpdateAssetDto = Partial<CreateAssetDto>;


// =================================
// Task
// =================================

export interface TaskDto {
    task_id: DbId;
    property_id: DbId;
    user_id: DbId;
    asset_id?: DbId;
    provider_id?: DbId;
    title: string;
    description?: string;
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    frequency: 'once' | 'weekly' | 'monthly' | 'quarterly' | 'biannually' | 'annually' | 'custom';
    scheduled_date: string; // ISO 8601 date string
    due_date?: string; // ISO 8601 date string
    completed_date?: string; // ISO 8601 date string
    estimated_cost?: number;
    actual_cost?: number;
    is_recurring: boolean;
    created_at: string; // ISO 8601 date string
    updated_at: string; // ISO 8601 date string
}

export type CreateTaskDto = Omit<TaskDto, 'task_id' | 'user_id' | 'created_at' | 'updated_at'>;
export type UpdateTaskDto = Partial<CreateTaskDto>;

// =================================
// Expense
// =================================

export interface ExpenseDto {
    expense_id: DbId;
    property_id: DbId;
    user_id: DbId;
    category_id: DbId;
    task_id?: DbId;
    description: string;
    amount: number;
    transaction_date: string; // ISO 8601 date string
    vendor?: string;
    receipt_url?: string;
    tax_deductible?: boolean;
    created_at: string; // ISO 8601 date string
    updated_at: string; // ISO 8601 date string
}

export type CreateExpenseDto = Omit<ExpenseDto, 'expense_id' | 'user_id' | 'created_at' | 'updated_at'>;
export type UpdateExpenseDto = Partial<CreateExpenseDto>;
