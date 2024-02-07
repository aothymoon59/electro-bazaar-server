/* eslint-disable @typescript-eslint/no-explicit-any */

export const generateQuery = (query: any) => {
  let filter: any = {};

  if (query?.minPrice !== undefined) {
    filter.price = { $gte: parseFloat(query?.minPrice) };
  }
  if (query?.maxPrice !== undefined) {
    filter.price = { ...filter.price, $lte: parseFloat(query.maxPrice) };
  }
  if (query?.releaseDate !== undefined) {
    filter = { ...filter, releaseDate: new Date(query?.releaseDate) };
  }
  if (query?.brand !== undefined) {
    filter = { ...filter, brand: query?.brand };
  }
  if (query?.modelNumber !== undefined) {
    filter = { ...filter, modelNumber: query?.modelNumber };
  }
  if (query?.category !== undefined) {
    filter = { ...filter, category: query?.category };
  }
  if (query?.operatingSystem !== undefined) {
    filter = { ...filter, operatingSystem: query?.operatingSystem };
  }
  if (query?.connectivity !== undefined) {
    filter = { ...filter, connectivity: query?.connectivity };
  }
  if (query?.powerSource !== undefined) {
    filter = { ...filter, powerSource: query?.powerSource };
  }
  if (query?.cameraResolution !== undefined) {
    filter = {
      ...filter,
      'features.cameraResolution': parseInt(query?.cameraResolution),
    };
  }
  if (query?.storage !== undefined) {
    filter = {
      ...filter,
      'features.storageCapacity': parseInt(query?.storage),
    };
  }

  return filter;
};
