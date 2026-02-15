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

export async function getEquipmentById(id: string): Promise<Equipment> {
  const response = await fetch(`${API_URL}/equipment/${id}`);
  if (!response.ok) throw new Error('Failed to fetch equipment');
  
  const data = await response.json();
  return data.data;
}

// Generate a professional description from equipment name and category
export function generateDescription(name: string, category: string): string {
  const cleanName = name.replace(/\|/g, '').trim();
  
  const descriptions: Record<string, string> = {
    'Cameras': `Professional cinema camera package suitable for high-end production work. Features robust build quality and industry-standard connections.`,
    'Lighting': `Professional lighting fixture for film and video production. Provides consistent, high-quality illumination for studio or location work.`,
    'Grip & Support': `Essential grip equipment for securing cameras, lights, and modifiers. Built for professional production environments.`,
    'Lenses': `High-quality cinema lens with smooth focus and iris control. Compatible with standard cinema camera mounts.`,
    'Power': `Professional power solution for cameras, monitors, and accessories. Reliable performance for extended shooting schedules.`,
    'Sound': `Professional audio equipment for capturing clean, broadcast-quality sound on set or location.`,
    'Motion': `Motion control equipment for dynamic camera movement. Enables smooth pans, tilts, and tracking shots.`,
    'Production': `Production accessory designed to streamline workflow and improve efficiency on set.`,
    'Accessories': `Essential production accessory compatible with standard industry equipment.`,
    'Styling': `Professional styling and art department equipment for set dressing and prop work.`
  };
  
  return descriptions[category] || `Professional ${category.toLowerCase()} equipment for film and video production.`;
}
