export type CouponStatus = 'active' | 'used' | 'expired';

export interface Coupon {
  id: string;
  productName: string; // 제품명
  discountAmount: number; // 할인액
  validFrom: string; // 쿠폰사용기간 시작 (YYYY-MM-DD)
  validTo: string; // 쿠폰사용기간 종료 (YYYY-MM-DD)
  appliedDate: string; // 신청일 (YYYY-MM-DD)
  status: CouponStatus;
}

export interface Promotion {
  id: string;
  productName: string;
  promotionPrice: number;
  costPrice: number;
  deadline: string;
}
