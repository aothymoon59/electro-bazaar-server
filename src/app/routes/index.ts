/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { ProductRoutes } from '../modules/product/product.route';
import { SalesHistoryRoutes } from '../modules/salesHistory/salesHistory.route';

type TRoute = {
  path: string;
  route: any;
};
const router = Router();

const moduleRoutes: TRoute[] = [
  { path: '/auth', route: UserRoutes },
  { path: '/products', route: ProductRoutes },
  { path: '/sales', route: SalesHistoryRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
