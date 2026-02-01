import "dotenv/config";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import rateLimit from "koa-ratelimit";
//Routers
import AuthRouter from "@/routes/auth.route";
import CustomerRouter from "@/routes/customer.routes";
import ProductRouter from "@/routes/product.routes";
import SalesRouter from "@/routes/sales.routes";

const app = new Koa();

const db = new Map();

app.use(bodyParser());
app.use(
  rateLimit({
    db,
    driver: "memory",
    duration: 60000,
    errorMessage: "WAIT. CALM DOWN. Please try again after 1 min.",
    max: 10,
  }),
);

app.use(AuthRouter.routes());
app.use(CustomerRouter.routes());
app.use(ProductRouter.routes());
app.use(SalesRouter.routes());

app.use(AuthRouter.allowedMethods());
app.use(CustomerRouter.allowedMethods());
app.use(ProductRouter.allowedMethods());
app.use(SalesRouter.allowedMethods());

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
