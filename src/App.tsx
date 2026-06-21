import React, { useState, useEffect } from 'react';
import { Coupon, CouponStatus, Promotion } from './types'; // Trigger HMR
import { CouponCard } from './components/CouponCard';
import { CouponForm } from './components/CouponForm';
import { PromotionForm } from './components/PromotionForm';
import { Ticket, Plus, LayoutDashboard, Search, Filter, Trash2 } from 'lucide-react';
import { isExpired, formatKRW } from './utils';

const INITIAL_MOCK_DATA: Coupon[] = [
  {
    id: '1',
    productName: '로켓프레시 신선/가공식품',
    discountAmount: 15000,
    validFrom: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0],
    validTo: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
    appliedDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0],
    status: 'active'
  },
  {
    id: '2',
    productName: '디지털/가전 전용 (애플 제외)',
    discountAmount: 50000,
    validFrom: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString().split('T')[0],
    validTo: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
    appliedDate: new Date(new Date().setDate(new Date().getDate() - 12)).toISOString().split('T')[0],
    status: 'expired'
  },
  {
    id: '3',
    productName: '아동 패션 골드박스 기획전',
    discountAmount: 3000,
    validFrom: new Date().toISOString().split('T')[0],
    validTo: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'active'
  }
];

const INITIAL_PROMOTION_MOCK_DATA: Promotion[] = [
  {
    id: '1',
    productName: '여름 시즌 반팔티 특가전',
    promotionPrice: 15900,
    costPrice: 9000,
    deadline: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]
  },
  {
    id: '2',
    productName: '캠핑용품 기획전 (텐트/침낭)',
    promotionPrice: 89000,
    costPrice: 55000,
    deadline: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0]
  }
];

export default function App() {
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('coupang_coupons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_MOCK_DATA;
      }
    }
    return INITIAL_MOCK_DATA;
  });

  const [promotions, setPromotions] = useState<Promotion[]>(() => {
    const saved = localStorage.getItem('coupang_promotions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_PROMOTION_MOCK_DATA;
      }
    }
    return INITIAL_PROMOTION_MOCK_DATA;
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPromoFormOpen, setIsPromoFormOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'used'>('all'); // expired is naturally handled within 'all' but disabled

  useEffect(() => {
    localStorage.setItem('coupang_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('coupang_promotions', JSON.stringify(promotions));
  }, [promotions]);

  const handleAddPromotion = (newPromoData: Omit<Promotion, 'id'>) => {
    const newPromo: Promotion = {
      ...newPromoData,
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    };
    setPromotions([newPromo, ...promotions]);
  };

  const handleDeletePromotion = (id: string) => {
    if (window.confirm('이 프로모션을 정말 삭제하시겠습니까?')) {
      setPromotions(promotions.filter(p => p.id !== id));
    }
  };

  const handleAddCoupon = (newCouponData: Omit<Coupon, 'id' | 'status'>) => {
    const newCoupon: Coupon = {
      ...newCouponData,
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      status: 'active'
    };
    setCoupons([newCoupon, ...coupons]);
  };

  const handleStatusChange = (id: string, newStatus: CouponStatus) => {
    setCoupons(coupons.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('이 쿠폰을 정말 삭제하시겠습니까?')) {
      setCoupons(coupons.filter(c => c.id !== id));
    }
  };

  // Compute stats
  const activeCoupons = coupons.filter(c => c.status === 'active' && !isExpired(c.validTo));

  // Filter for display
  const filteredCoupons = coupons.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'active') return c.status === 'active' && !isExpired(c.validTo);
    if (filter === 'used') return c.status === 'used';
    return true;
  }).sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());

  return (
    <div className="min-h-screen font-sans bg-[#f3f4f6]">
      {/* Header */}
      <header className="bg-white sticky top-0 z-30 shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 p-2 rounded-lg text-white">
              <Ticket size={20} />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900 hidden sm:block">쿠팡 쿠폰 매니저</h1>
            <h1 className="text-lg font-extrabold tracking-tight text-gray-900 sm:hidden">쿠폰 매니저</h1>
          </div>
          
          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
          >
            <Plus size={16} />
            쿠폰 등록
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Coupons List Header & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
          <h2 className="text-xl font-bold text-gray-900">내 쿠폰 목록</h2>
          
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200 self-start sm:self-auto">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${filter === 'all' ? 'bg-gray-900 text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
            >
              전체보기
            </button>
            <button 
              onClick={() => setFilter('active')}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-1 ${filter === 'active' ? 'bg-white text-red-600 shadow ring-1 ring-gray-900/5' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${filter === 'active' ? 'bg-red-600' : 'bg-transparent'}`}></span>
              사용가능
            </button>
            <button 
              onClick={() => setFilter('used')}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${filter === 'used' ? 'bg-white text-gray-900 shadow ring-1 ring-gray-900/5' : 'text-gray-600 hover:text-gray-900'}`}
            >
              사용완료
            </button>
          </div>
        </div>

        {/* Coupons List */}
        {filteredCoupons.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-6 pb-20">
            {filteredCoupons.map(coupon => (
              <CouponCard 
                key={coupon.id} 
                coupon={coupon} 
                onStatusChange={handleStatusChange} 
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border flex flex-col border-dashed border-gray-300 items-center justify-center py-24 text-center px-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">조건에 맞는 쿠폰이 없습니다</h3>
            <p className="text-gray-500 text-sm max-w-sm mb-6">위쪽의 '쿠폰 등록' 버튼을 눌러 새로운 할인 혜택을 추가하거나 필터를 변경해보세요.</p>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="text-red-600 font-medium text-sm hover:underline"
            >
              새 쿠폰 추가하기 &rarr;
            </button>
          </div>
        )}

        {/* Promotion History Section */}
        <div className="mt-16 pb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="text-red-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">프로모션 신청 내역</h2>
            </div>
            <button 
              onClick={() => setIsPromoFormOpen(true)}
              className="flex items-center gap-1.5 bg-gray-900 hover:bg-black text-white px-3 py-1.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
            >
              <Plus size={16} />
              품목 추가
            </button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold">제품명</th>
                    <th className="px-6 py-4 font-semibold">프로모션가</th>
                    <th className="px-6 py-4 font-semibold">원가</th>
                    <th className="px-6 py-4 font-semibold">순이익</th>
                    <th className="px-6 py-4 font-semibold">마진율</th>
                    <th className="px-6 py-4 font-semibold">마감일</th>
                    <th className="px-6 py-4 font-semibold text-center w-20">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {promotions.map((promo) => {
                    const SHIPPING_FEE = 1900;
                    const PACKAGING_FEE = 1000;
                    const netProfit = promo.promotionPrice - (promo.costPrice + SHIPPING_FEE) - PACKAGING_FEE;
                    const marginRate = (netProfit / promo.promotionPrice * 100).toFixed(1);
                    return (
                      <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{promo.productName}</td>
                        <td className="px-6 py-4 text-red-600 font-semibold">{formatKRW(promo.promotionPrice)}원</td>
                        <td className="px-6 py-4 text-gray-600">{formatKRW(promo.costPrice)}원</td>
                        <td className="px-6 py-4 text-green-600 font-medium">{formatKRW(netProfit)}원</td>
                        <td className="px-6 py-4 text-blue-600 font-medium">{marginRate}%</td>
                        <td className="px-6 py-4 text-gray-600">{promo.deadline}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDeletePromotion(promo.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="삭제"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Add Coupon Modal */}
      {isFormOpen && (
        <CouponForm 
          onAdd={handleAddCoupon} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}

      {/* Add Promotion Modal */}
      {isPromoFormOpen && (
        <PromotionForm 
          onAdd={handleAddPromotion} 
          onClose={() => setIsPromoFormOpen(false)} 
        />
      )}
    </div>
  );
}
