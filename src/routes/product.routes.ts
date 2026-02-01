import Router from "@koa/router";

const router = new Router({
  prefix: "/product",
  methods: ["GET", "POST", "PUT", "PATCH"],
});

import {
  createProduct,
  getAllProducts,
  getProductById,
  softDeleteProduct,
  updateProductDetails,
} from "@/controller/product.controller";
import withAuth from "@/lib/helper/withAuth";

router.get("/", getAllProducts);
router.post("/", withAuth, createProduct);
router.get("/:id", getProductById);
router.patch("/:id", withAuth, softDeleteProduct);
router.put("/:id", withAuth, updateProductDetails);

export default router;
