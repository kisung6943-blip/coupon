import React from 'react';
import { Coupon } from '../types';
import { formatKRW, formatDate, isExpired, getDDay } from '../utils';
import { Clock, Calendar, CheckCircle, AlertCircle, ShoppingBag } from 'lucide-react';

interface CouponCardProps {
  coupon: Coupon;
  onStatusChange: (id: string, newStatus: Required<Coupon>['status']) => void;
  onDelete: (id: string) => void;
}

export const CouponCard: React.FC<CouponCardProps> = ({ coupon, onStatusChange, onDelete }) => {
  const expired = isExpired(coupon.validTo) && coupon.status !== 'used';
  const effectiveStatus = expired ? 'expired' : coupon.status;
  
  const dday = getDDay(coupon.validTo);
  const isUrgent = dday.isUrgent && effectiveStatus === 'active';

  const getStatusBadge = () => {
    switch (effectiveStatus) {
      case 'active':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700"><CheckCircle size={12} /> 사용가능</span>;
      case 'used':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"><CheckCircle size={12} /> 사용완료</span>;
      case 'expired':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500"><AlertCircle size={12} /> 기간만료</span>;
    }
  };

  return (
    <div className={`bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md ${effectiveStatus !== 'active' ? 'opacity-75 relative' : ''}`}>
      <div className="flex flex-col sm:flex-row">
        {/* Left side - Expiration / D-Day */}
        <div className={`flex flex-col justify-center items-center p-6 border-b sm:border-b-0 sm:border-r border-dashed border-gray-200 min-w-[140px] shadow-sm ${
          effectiveStatus === 'active' 
             ? (isUrgent ? 'bg-red-50' : 'bg-blue-50')
             : 'bg-gray-50'
        }`}>
          <span className="text-sm font-medium text-gray-500 mb-1">마감일</span>
          <span className={`text-3xl sm:text-4xl font-black tracking-tight ${
            effectiveStatus === 'active' 
              ? (isUrgent ? 'text-red-600' : 'text-blue-600')
              : 'text-gray-400'
          }`}>
            {effectiveStatus === 'active' ? dday.label : '만료'}
          </span>
          <span className="text-xs font-medium text-gray-500 mt-2">
            {formatDate(coupon.validTo)} 까지
          </span>
        </div>
        
        {/* Right side - Details */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-gray-400 size-4 sm:size-5" />
              <h3 className={`font-semibold text-base sm:text-lg ${effectiveStatus === 'active' ? 'text-gray-900' : 'text-gray-500 line-through decoration-gray-300'}`}>{coupon.productName}</h3>
            </div>
            {getStatusBadge()}
          </div>
          
          <div className="flex items-center gap-2 mt-1 mb-4">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg ${effectiveStatus === 'active' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
              <span className="font-bold text-sm">₩</span>
              <span className="font-bold">{formatKRW(coupon.discountAmount)} 할인</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="text-gray-400 size-4" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">사용기간</span>
                <span>{formatDate(coupon.validFrom)} ~ {formatDate(coupon.validTo)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="text-gray-400 size-4" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">신청일</span>
                <span>{formatDate(coupon.appliedDate)}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end gap-2">
            {effectiveStatus === 'active' && (
              <button 
                onClick={() => onStatusChange(coupon.id, 'used')}
                className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors border border-transparent"
              >
                사용 처리
              </button>
            )}
            {effectiveStatus === 'used' && (
              <button 
                onClick={() => onStatusChange(coupon.id, 'active')}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
              >
                사용 취소
              </button>
            )}
            <button 
              onClick={() => onDelete(coupon.id)}
              className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-red-600 bg-white border border-gray-200 hover:bg-red-50 hover:border-red-100 rounded-lg transition-colors"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative semi-circles to mimic a real ticket */}
      <div className="absolute top-0 bottom-0 left-[-8px] sm:left-[132px] w-4 mt-6 mb-auto h-4 rounded-full bg-[#f3f4f6] shadow-inner hidden sm:block border-r border-gray-200" style={{top: 'calc(50% - 8px)'}} />
    </div>
  );
};

