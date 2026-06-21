import React, { useState } from 'react';
import { Coupon } from '../types';
import { X, PlusCircle } from 'lucide-react';

interface CouponFormProps {
  onAdd: (coupon: Omit<Coupon, 'id' | 'status'>) => void;
  onClose: () => void;
}

export const CouponForm: React.FC<CouponFormProps> = ({ onAdd, onClose }) => {
  const [productName, setProductName] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [validFrom, setValidFrom] = useState(new Date().toISOString().split('T')[0]);
  const [validTo, setValidTo] = useState('');
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !discountAmount || !validFrom || !validTo || !appliedDate) return;

    onAdd({
      productName,
      discountAmount: Number(discountAmount.replace(/[^0-9]/g, '')),
      validFrom,
      validTo,
      appliedDate,
    });
    onClose();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    if (rawValue) {
      setDiscountAmount(Number(rawValue).toLocaleString('ko-KR'));
    } else {
      setDiscountAmount('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 pb-4">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">새 쿠폰 추가</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 sm:space-y-5 flex flex-col">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">제품명 또는 카테고리</label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder-gray-400 text-sm sm:text-base"
              placeholder="예: 로켓프레시 신선식품"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">할인액</label>
            <div className="relative">
              <input
                type="text"
                required
                value={discountAmount}
                onChange={handleAmountChange}
                className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm sm:text-base text-right font-medium"
                placeholder="5,000"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">원</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">사용기간 시작일</label>
              <input
                type="date"
                required
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">사용기간 종료일</label>
              <input
                type="date"
                required
                min={validFrom}
                value={validTo}
                onChange={(e) => setValidTo(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">쿠폰 신청일</label>
            <input
              type="date"
              required
              value={appliedDate}
              onChange={(e) => setAppliedDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-3 px-4 rounded-xl font-semibold transition-colors shadow-sm"
            >
              <PlusCircle size={18} />
              쿠폰 등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
