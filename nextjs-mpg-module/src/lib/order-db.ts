export interface OrderRecord {
  id: string;
  orderId: string;
  amount: number;
  finalAmount?: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: "PENDING" | "PAID" | "EXPIRED" | "FAILED";
  detectedBank?: string;
  checkoutUrl?: string;
  qrString?: string;
  paidAt?: Date;
  serviceActivated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Storage in-memory (singleton untuk Next.js hot-reload development)
const globalOrders = globalThis as unknown as {
  __mpg_orders_db?: Map<string, OrderRecord>;
};

if (!globalOrders.__mpg_orders_db) {
  globalOrders.__mpg_orders_db = new Map<string, OrderRecord>();
}

const db = globalOrders.__mpg_orders_db;

export async function findOrderByOrderId(
  orderId: string
): Promise<OrderRecord | null> {
  return db.get(orderId) || null;
}

export async function createOrderRecord(
  data: Omit<OrderRecord, "id" | "createdAt" | "updatedAt">
): Promise<OrderRecord> {
  const record: OrderRecord = {
    ...data,
    id: `db_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  db.set(data.orderId, record);
  return record;
}

export async function updateOrderStatus(
  orderId: string,
  update: {
    status: "PENDING" | "PAID" | "EXPIRED" | "FAILED";
    finalAmount?: number;
    detectedBank?: string;
    paidAt?: Date;
    serviceActivated?: boolean;
    checkoutUrl?: string;
    qrString?: string;
  }
): Promise<OrderRecord | null> {
  const existing = db.get(orderId);
  if (!existing) return null;

  const updatedRecord: OrderRecord = {
    ...existing,
    ...update,
    updatedAt: new Date(),
  };

  db.set(orderId, updatedRecord);
  return updatedRecord;
}
