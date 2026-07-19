import { Address } from '@/domain/models/address/get-address-reponse';
import { StateCreator } from 'zustand';

export type addressSliceType = {
  showAddressModuleLoader: boolean;
  toggleAddressModuleLoader: (toggle: boolean) => void;
  addressList: Address[];
  setAddressList: (addresses: Address[]) => void;
  addOrUpdateAddress: (address: Address) => void;
  clearAddressList: () => void;
  removeAddress: (id: number) => void;
};

export const createAddressSlice: StateCreator<addressSliceType> = (set, get) => ({
  showAddressModuleLoader: false,
  addressList: [],
  setAddressList: (addresses) => set({ addressList: addresses }),
  toggleAddressModuleLoader: (toggle) => set({ showAddressModuleLoader: toggle }),
  addOrUpdateAddress: (address) => {
    const prev = get().addressList;
    const exists = prev.some((a) => a.id === address.id);
    set({
      addressList: exists ? prev.map((a) => (a.id === address.id ? address : a)) : [...prev, address],
    });
  },
  clearAddressList: () => set({ addressList: [] }),
  removeAddress: (id) => set({ addressList: get().addressList.filter((a) => a.id !== id) }),
});
