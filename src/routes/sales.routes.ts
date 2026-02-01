import { createSale, getSales } from "@/controller/sales.controller";
import withAuth from "@/lib/helper/withAuth";
import Router from "@koa/router";

const router = new Router({
  prefix: "/sales",
  methods: ["GET", "POST"],
});

router.get("/", withAuth, getSales);
router.post("/", withAuth, createSale);

export default router;
