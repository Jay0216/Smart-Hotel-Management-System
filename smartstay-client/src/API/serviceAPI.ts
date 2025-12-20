const API_BASE_URL = 'http://localhost:3000/api/services';

export interface ServiceFormData {
  branchName: string;
  name: string;
  category?: string;
  price: number;
  pricingType?: 'Fixed' | 'Variable';
  availability?: 'Available' | 'Unavailable';
  images: FileList | null;
}

export interface Service {
  id: number;
  branch_name: string;
  name: string;
  category?: string;
  price: number;
  pricing_type: string;
  availability: string;
  images?: string[];
}

// Add a new service
export const addService = async (formData: FormData): Promise<{ service: Service; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/addservice`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add service');
  }

  return response.json();
};

// Fetch all services
export const getServices = async (): Promise<Service[]> => {
  const response = await fetch(`${API_BASE_URL}/getservices`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch services');
  }

  const data = await response.json();
  return data.services;
};
