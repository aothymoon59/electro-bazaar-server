/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateQuery } from './generateQuery';

// Function to process the query object
export const processQuery = (queryObj: any, fieldsToRemove: string[]) => {
  // Generate additional filter criteria
  const additionalFilters = generateQuery(queryObj);

  // Clean up queryObj: Remove specified fields
  fieldsToRemove.forEach((field: string) => {
    // Remove the field if it exists in queryObj
    if (Object.prototype.hasOwnProperty.call(queryObj, field)) {
      delete queryObj[field];
    }
  });

  return { additionalFilters, cleanedQueryObj: queryObj };
};
