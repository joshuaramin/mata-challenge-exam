-- CreateTable
CREATE TABLE "Customer" (
    "customer_id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "profile_id" TEXT NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customer_id" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("profile_id")
);

-- CreateTable
CREATE TABLE "Product" (
    "product_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "Sales" (
    "sales_id" TEXT NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "sale_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customer_id" TEXT,

    CONSTRAINT "Sales_pkey" PRIMARY KEY ("sales_id")
);

-- CreateTable
CREATE TABLE "SalesItem" (
    "sales_item_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "subTotal" DECIMAL(12,2) NOT NULL,
    "product_id" TEXT,
    "sales_id" TEXT,

    CONSTRAINT "SalesItem_pkey" PRIMARY KEY ("sales_item_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE INDEX "Customer_created_at_idx" ON "Customer"("created_at");

-- CreateIndex
CREATE INDEX "Customer_is_deleted_idx" ON "Customer"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_customer_id_key" ON "Profile"("customer_id");

-- CreateIndex
CREATE INDEX "Profile_first_name_idx" ON "Profile"("first_name");

-- CreateIndex
CREATE INDEX "Profile_last_name_idx" ON "Profile"("last_name");

-- CreateIndex
CREATE INDEX "Profile_is_deleted_idx" ON "Profile"("is_deleted");

-- CreateIndex
CREATE INDEX "Product_name_idx" ON "Product"("name");

-- CreateIndex
CREATE INDEX "Product_price_idx" ON "Product"("price");

-- CreateIndex
CREATE INDEX "Product_is_deleted_idx" ON "Product"("is_deleted");

-- CreateIndex
CREATE INDEX "Product_created_at_idx" ON "Product"("created_at");

-- CreateIndex
CREATE INDEX "Sales_customer_id_idx" ON "Sales"("customer_id");

-- CreateIndex
CREATE INDEX "Sales_sale_date_idx" ON "Sales"("sale_date");

-- CreateIndex
CREATE INDEX "SalesItem_sales_id_idx" ON "SalesItem"("sales_id");

-- CreateIndex
CREATE INDEX "SalesItem_product_id_idx" ON "SalesItem"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "SalesItem_sales_id_product_id_key" ON "SalesItem"("sales_id", "product_id");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesItem" ADD CONSTRAINT "SalesItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesItem" ADD CONSTRAINT "SalesItem_sales_id_fkey" FOREIGN KEY ("sales_id") REFERENCES "Sales"("sales_id") ON DELETE SET NULL ON UPDATE CASCADE;
