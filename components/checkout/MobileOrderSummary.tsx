'use client';

interface MobileOrderSummaryProps {
  total: number;
}

export default function MobileOrderSummary({ total }: MobileOrderSummaryProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <p className="text-sm text-gray-600">Total Amount</p>
        <p className="font-bold text-xl text-blue-600">₦{total.toLocaleString()}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-600">Includes tax & shipping</p>
        <p className="text-xs text-gray-500">Tap for details</p>
      </div>
    </div>
  );
}