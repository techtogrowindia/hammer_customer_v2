import { AppColors } from '@/core/theme/app-colors';
import { AddressRepository } from '@/data/repositories/address/address-repository';
import { AddAddressRequest } from '@/data/requests/address/address-request-builder';
import { useBoundStore } from '@/store/boundStore';
import { router } from 'expo-router';
import { toastiva } from 'toastiva';
import { useShallow } from 'zustand/shallow';

export const useAddressApisHelper = () => {
  const { toggleAddressModuleLoader, addOrUpdateAddress, setAddressList, addressList, removeAddress } = useBoundStore(
    useShallow((state) => ({
      toggleAddressModuleLoader: state.toggleAddressModuleLoader,
      setAddressList: state.setAddressList,
      addOrUpdateAddress: state.addOrUpdateAddress,
      addressList: state.addressList,
      removeAddress: state.removeAddress,
    })),
  );
  const addAddress = async (request: AddAddressRequest) => {
    toggleAddressModuleLoader(true);
    try {
      const response = await AddressRepository.addAddress(request);

      if (!response?.success) {
        throw new Error(response?.message);
      }

      if (response?.data && response?.data?.address_line_1) {
        addOrUpdateAddress(response.data);
      }
      router.dismissTo({ pathname: '/(tabs)/(home)/address/select-address' });

      return response;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || 'Unable to save address. Please try again later.';

      toastiva.error(message, {
        fill: AppColors.white,
        styles: {
          title: { color: AppColors.error },
        },
        showProgress: false,
      });
      console.error('Error adding address:', error);
      throw error;
    } finally {
      toggleAddressModuleLoader(false);
    }
  };
  const editAddress = async (request: AddAddressRequest) => {
    toggleAddressModuleLoader(true);
    try {
      const response = await AddressRepository.editAddress(request);

      if (!response?.success) {
        throw new Error(response?.message);
      }

      if (response?.data && response?.data?.address_line_1) {
        const isEditFound = addressList.find((address) => address.id === response?.data?.id);
        if (isEditFound) {
          addOrUpdateAddress(response.data);
        } else {
          throw new Error('Something went wrong while updating the address. Please try again later.');
        }
      }
      router.dismissTo({ pathname: '/(tabs)/(home)/address/select-address' });

      return response;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || 'Unable to save address. Please try again later.';

      toastiva.error(message, {
        fill: AppColors.white,
        styles: {
          title: { color: AppColors.error },
        },
        showProgress: false,
      });
      console.error('Error adding address:', error);
      throw error;
    } finally {
      toggleAddressModuleLoader(false);
    }
  };
  const getAddresses = async () => {
    toggleAddressModuleLoader(true);
    try {
      const response = await AddressRepository.getAddress();

      if (!response?.success) {
        throw new Error(response?.message);
      }

      if (response?.data && response?.data?.addresses) {
        setAddressList(response?.data?.addresses?.length > 0 ? response?.data?.addresses : []);
      }

      return response;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || 'Unable to fetch addresses. Please try again later.';

      //   toastiva.error(message, {
      //     fill: AppColors.white,
      //     styles: {
      //       title: { color: AppColors.error },
      //     },
      //     showProgress: false,
      //   });
      console.error('Error fetching addresses:', error);
      throw error;
    } finally {
      toggleAddressModuleLoader(false);
    }
  };
  const deleteAddress = async (addressId: number) => {
    toggleAddressModuleLoader(true);
    try {
      const response = await AddressRepository.deleteAddress(addressId);

      if (!response?.success) {
        throw new Error(response?.message);
      }
      if (response?.success) {
        removeAddress(addressId);
      }

      return response;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || 'Unable to delete address. Please try again later.';

      toastiva.error(message, {
        fill: AppColors.white,
        styles: {
          title: { color: AppColors.error },
        },
        showProgress: false,
      });
      console.error('Error deleting address:', error);
      throw error;
    } finally {
      toggleAddressModuleLoader(false);
    }
  };

  return {
    addAddress,
    editAddress,
    getAddresses,
    deleteAddress,
  };
};
