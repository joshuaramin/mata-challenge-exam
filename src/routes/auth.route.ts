import { login, register } from "@/controller/auth.controller";
import Router from "@koa/router";

const router = new Router({
  prefix: "/auth",
  methods: ["POST"],
});

router.post("/login", login);
router.post("/register", register);

export default router;
