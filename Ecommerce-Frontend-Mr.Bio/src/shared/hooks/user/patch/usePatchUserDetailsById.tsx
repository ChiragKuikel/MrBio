import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { API } from '../../../../services/api';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Address {
  zip: string;
  city: string;
  state: string;
  line1: string;
  line2: string;
  location: {
    coordinates: Coordinates;
  };
}

interface Phone {
  value: string;
  countryCode: string;
  countryISO: string;
  type: 'cell' | 'home' | 'work';
}

export interface UpdateUserPayload {
  dob: string;
  email: string;
  phones: Phone[];
  lastName: string;
  firstName: string;
  middleName: string;
  gender: 'male' | 'female' | 'other';
  address: Address;
}

export function useUpdateUserDetails(
  userId: string,
  options?: UseMutationOptions<unknown, Error, Partial<UpdateUserPayload>>
) {
  return useMutation<unknown, Error, Partial<UpdateUserPayload>>({
    mutationFn: (payload) => {
      return API.patch(`/users/${userId}`, payload).then(res => res.data);
    },
    ...options,
  });
}
