/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
import UserRoutes from '../modules/user/user.route';
import ProductRoutes from '../modules/product/product.route';

type TRoute = {
  path: string;
  route: any;
};
const router = Router();

// TODO: add routes here
const moduleRoutes: TRoute[] = [
  { path: '/products', route: ProductRoutes },
  { path: '/auth', route: UserRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
