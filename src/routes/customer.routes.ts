import Router from "@koa/router";

const router = new Router({
  prefix: "/customer",
  methods: ["GET", "POST", "PUT", "PATCH"],
});
import {
  getAllCustomer,
  getCustomerById,
  softDeleteCustomer,
  updateCustomerDetails,
} from "@/controller/customer.controller";
import withAuth from "@/lib/helper/withAuth";

router.get("/", withAuth, getAllCustomer);
router.get("/:id", withAuth, getCustomerById);
router.put("/:id", withAuth, updateCustomerDetails);
router.patch("/:id", withAuth, softDeleteCustomer);

export default router;
