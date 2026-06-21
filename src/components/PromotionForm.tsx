import React, { useState } from 'react';
import { Promotion } from '../types';
import { X, PlusCircle } from 'lucide-react';

interface PromotionFormProps {
  onAdd: (promotion: Omit<Promotion, 'id'>) => void;
  onClose: () => void;
}

export const PromotionForm: React.FC<PromotionFormProps> = ({ onAdd, onClose }) => {
  const [productName, setProductName] = useState('');
  const [promotionPrice, setPromotionPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !promotionPrice || !costPrice || !deadline) return;

    onAdd({
      productName,
      promotionPrice: Number(promotionPrice.replace(/[^0-9]/g, '')),
      costPrice: Number(costPrice.replace(/[^0-9]/g, '')),
      deadline,
    });
    onClose();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    if (rawValue) {
      setter(Number(rawValue).toLocaleString('ko-KR'));
    } else {
      setter('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 pb-4">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">새 프로모션 품목 추가</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 sm:space-y-5 flex flex-col">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">제품명</label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder-gray-400 text-sm sm:text-base"
              placeholder="예: 여름 시즌 반팔티 특가전"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">프로모션가</label>
            <div className="relative">
              <input
                type="text"
                required
                value={promotionPrice}
                onChange={(e) => handleAmountChange(e, setPromotionPrice)}
                className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm sm:text-base text-right font-medium"
                placeholder="15,900"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">원</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">원가</label>
            <div className="relative">
              <input
                type="text"
                required
                value={costPrice}
                onChange={(e) => handleAmountChange(e, setCostPrice)}
                className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm sm:text-base text-right font-medium"
                placeholder="9,000"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">원</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">마감일</label>
            <input
              type="date"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-3 px-4 rounded-xl font-semibold transition-colors shadow-sm"
            >
              <PlusCircle size={18} />
              품목 추가하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
