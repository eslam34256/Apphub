import { DealItem } from "@/lib/types";
export const deals: DealItem[] = [
  { id:"d1", title:"خصم 30% على أول طلب", brand:"طلبات", category:"food", discount:30, views:1420, expiresAt:"2025-12-31", code:"APPHUB30" },
  { id:"d2", title:"خصم 20% على سماعات وتكنولوجيا", brand:"Amazon", category:"tech", discount:20, views:1940, expiresAt:"2025-11-30" },
  { id:"d3", title:"خصم 15% على منتجات العناية", brand:"Noon", category:"beauty", discount:15, views:880, expiresAt:"2025-10-10", code:"CARE15" },
  { id:"d4", title:"خصم 25% على أول رحلة", brand:"Careem", category:"food", discount:25, views:1020, expiresAt:"2025-09-20", code:"RIDE25" },
  { id:"d5", title:"خصم 40% على الأزياء المختارة", brand:"Noon", category:"fashion", discount:40, views:2110, expiresAt:"2025-10-01" }
];
