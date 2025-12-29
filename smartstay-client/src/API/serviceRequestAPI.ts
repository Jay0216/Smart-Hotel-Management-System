const BASE_URL = "http://localhost:3000/api";

// ==================
// Service Request Types
// ==================

export interface CreateServiceRequestInput {
  guest_id: string;
  branch_name: string;
  service_id: number;
  request_service_name: string;
  request_note?: string | null;
}

export type ServiceRequestStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface ServiceRequest {
  request_id: number;
  guest_id: string;
  branch_id: number;
  service_id: number;
  service_name: string;
  request_note: string | null;
  status: ServiceRequestStatus;
  created_at: string;
  updated_at?: string;
}

// Backend response type (what actually comes from server)
interface BackendServiceRequest {
  id: number;
  request_status: string;
  request_note: string | null;
  requested_at: string;
  service_name: string;
  first_name?: string;
  last_name?: string;
  guest_id?: string;
  branch_id?: number;
  service_id?: number;
  branch_name?: string;
  service_price?: number;
}

// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ServiceRequest {
  request_id: number;
  guest_id: string;
  branch_id: number;
  service_id: number;
  service_name: string;
  request_note: string | null;
  status: ServiceRequestStatus;
  created_at: string;

  // 👇 ADMIN VIEW DATA
  guest_first_name?: string;
  guest_last_name?: string;
  branch_name?: string;
  service_price?: number;
}

// Transform backend response to frontend format
const transformServiceRequest = (
  backend: BackendServiceRequest
): ServiceRequest => {
  return {
    request_id: backend.id,
    guest_id: backend.guest_id || '',
    branch_id: backend.branch_id || 0,
    service_id: backend.service_id || 0,
    service_name: backend.service_name,
    request_note: backend.request_note,
    status: backend.request_status.toLowerCase() as ServiceRequestStatus,
    created_at: backend.requested_at,

    // ✅ ADMIN DATA
    guest_first_name: backend.first_name,
    guest_last_name: backend.last_name,
    branch_name: backend.branch_name,
    service_price: backend.service_price
  };
};

export const createServiceRequestAPI = async (
  data: CreateServiceRequestInput
): Promise<ApiResponse<ServiceRequest>> => {
  const res = await fetch(`${BASE_URL}/service-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create service request");
  }

  const response = await res.json();
  
  // If backend returns raw data, wrap and transform it
  if (Array.isArray(response)) {
    return {
      success: true,
      message: "Service request created",
      data: transformServiceRequest(response[0])
    };
  }
  
  return response;
};

export const getGuestServiceRequestsAPI = async (
  guestId: string
): Promise<ApiResponse<ServiceRequest[]>> => {
  const res = await fetch(
    `${BASE_URL}/service-requests/guest/${guestId}`
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch service requests");
  }

  const response = await res.json();
  
  // Transform backend response to frontend format
  if (Array.isArray(response)) {
    const transformed = response.map(transformServiceRequest);
    return {
      success: true,
      message: "Service requests fetched",
      data: transformed
    };
  }
  
  return response;
};

export const getBranchServiceRequestsAPI = async (
  branchId: number
): Promise<ApiResponse<ServiceRequest[]>> => {
  const res = await fetch(
    `${BASE_URL}/service-requests/branch/${branchId}`
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch branch requests");
  }

  const response = await res.json();
  
  // Transform backend response
  if (Array.isArray(response)) {
    const transformed = response.map(transformServiceRequest);
    return {
      success: true,
      message: "Branch requests fetched",
      data: transformed
    };
  }
  
  return response;
};

export interface UpdateServiceRequestStatusInput {
  requestId: number;
  status: ServiceRequestStatus;
}

export const updateServiceRequestStatusAPI = async ({
  requestId,
  status
}: UpdateServiceRequestStatusInput): Promise<ApiResponse<ServiceRequest>> => {
  const res = await fetch(
    `${BASE_URL}/service-requests/${requestId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update request status");
  }

  const response = await res.json();
  
  // Transform backend response
  if (Array.isArray(response)) {
    return {
      success: true,
      message: "Status updated",
      data: transformServiceRequest(response[0])
    };
  }
  
  return response;
};


export const getAllServiceRequestsAPI = async (): Promise<ApiResponse<ServiceRequest[]>> => {
  const res = await fetch(`${BASE_URL}/service-requests/all`);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch all service requests");
  }

  const response = await res.json();

  if (Array.isArray(response)) {
    const transformed = response.map(transformServiceRequest);
    return {
      success: true,
      message: "All service requests fetched",
      data: transformed
    };
  }

  return response;
};