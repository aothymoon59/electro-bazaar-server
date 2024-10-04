/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
// import { UserRoutes } from '../modules/user/user.route';
import { ProductRoutes } from '../modules/product/product.route';
import { SalesHistoryRoutes } from '../modules/sales/salesHistory.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { UserRoutes } from '../modules/user/user.route';

type TRoute = {
  path: string;
  route: any;
};
const router = Router();

const moduleRoutes: TRoute[] = [
  { path: '/auth', route: AuthRoutes },
  { path: '/users', route: UserRoutes },
  { path: '/products', route: ProductRoutes },
  { path: '/sales', route: SalesHistoryRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
