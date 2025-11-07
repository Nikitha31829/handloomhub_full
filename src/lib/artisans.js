import { artisans } from '../data/artisans';
export const byVendor = (vendor) => artisans.find(a => a.vendorKey === vendor);
export const byId = (id) => artisans.find(a => String(a.id) === String(id));