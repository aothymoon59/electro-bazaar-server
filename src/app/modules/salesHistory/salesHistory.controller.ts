import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SalesHistoryServices } from './salesHistory.service';

const createSales = catchAsync(async (req, res) => {
  const result = await SalesHistoryServices.createSalesIntoDb(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Sales created successfully',
    data: result,
  });
});
const getSalesHistory = catchAsync(async (req, res) => {
  const result = await SalesHistoryServices.getSalesHistoryFromDB(
    req.query as Record<string, string>,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Sales retrieved successfully',
    data: result,
  });
});

export const SalesHistoryControllers = { createSales, getSalesHistory };
