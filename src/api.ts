const API_URL = 'http://localhost:3001/api';

export interface Equipment {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  category: string;
  sub_category: string | null;
  partner_price: number | null;
  retail_price: number | null;
  image_url: string | null;
  availability: 'in-house' | 'partner';
  in_house: {
    quantity_available: number;
    storage_location: string | null;
  } | null;
}

export interface Category {
  id: string;
  name: string;
  display_order: number;
}

export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface EquipmentResponse {
  data: Equipment[];
  pagination: Pagination;
}

export async function getEquipment(
  category?: string, 
  search?: string, 
  page: number = 1, 
  limit: number = 25
): Promise<EquipmentResponse> {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (search) params.append('search', search);
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  const response = await fetch(`${API_URL}/equipment?${params}`);
  if (!response.ok) throw new Error('Failed to fetch equipment');
  
  return await response.json();
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/equipment/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  
  const data = await response.json();
  return data.data;
}
