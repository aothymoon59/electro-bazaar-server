/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
import UserRoutes from '../modules/user/user.route';

type TRoute = {
  path: string;
  route: any;
};
const router = Router();

// TODO: add routes here
const moduleRoutes: TRoute[] = [{ path: '/auth', route: UserRoutes }];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
