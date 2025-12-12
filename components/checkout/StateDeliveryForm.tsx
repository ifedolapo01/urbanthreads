'use client';

import { Home, Store } from 'lucide-react';

interface StateDeliveryFormProps {
  selectedState: string;
  deliveryOption: 'pickup' | 'delivery';
  setSelectedState: (state: string) => void;
  setDeliveryOption: (option: 'pickup' | 'delivery') => void;
  pickupAddress: string;
}

export default function StateDeliveryForm({
  selectedState,
  deliveryOption,
  setSelectedState,
  setDeliveryOption,
  pickupAddress
}: StateDeliveryFormProps) {
  
  const getDeliveryFee = (state: string): number => {
    return state === 'Abuja' ? 3000 : 5000;
  };

  const isPickupAvailable = selectedState === 'Abuja';

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    if (state !== 'Abuja' && deliveryOption === 'pickup') {
      setDeliveryOption('delivery');
    }
  };

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 md:mb-6 text-gray-800">Delivery Method</h2>
      
      {/* State Selection */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
          Select Your State *
        </label>
        <select 
          value={selectedState}
          onChange={(e) => handleStateChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 bg-white text-sm sm:text-base md:text-lg font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="Abuja">Abuja (₦3,000 delivery / Free pickup)</option>
          <option value="Lagos">Lagos (₦5,000 delivery)</option>
          <option value="Rivers">Rivers (₦5,000 delivery)</option>
          <option value="Kano">Kano (₦5,000 delivery)</option>
          <option value="Oyo">Oyo (₦5,000 delivery)</option>
          <option value="Other">Other States (₦5,000 delivery)</option>
        </select>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
          Pickup is only available in Abuja. Delivery to other states is to designated parks.
        </p>
      </div>
      
      {/* Delivery Option Selection - Horizontal on mobile, grid on desktop */}
      <div className="flex sm:grid sm:grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 overflow-x-auto pb-2 -mx-3 sm:mx-0 px-3 sm:px-0">
        {/* Pickup Option */}
        <PickupOption 
          isPickupAvailable={isPickupAvailable}
          deliveryOption={deliveryOption}
          setDeliveryOption={setDeliveryOption}
          pickupAddress={pickupAddress}
        />
        
        {/* Delivery Option */}
        <DeliveryOption 
          deliveryOption={deliveryOption}
          setDeliveryOption={setDeliveryOption}
          selectedState={selectedState}
          getDeliveryFee={getDeliveryFee}
        />
      </div>
      
      {/* Additional Info */}
      <DeliveryInfo 
        deliveryOption={deliveryOption}
        isPickupAvailable={isPickupAvailable}
        selectedState={selectedState}
      />
    </div>
  );
}

function PickupOption({ isPickupAvailable, deliveryOption, setDeliveryOption, pickupAddress }: any) {
  return (
    <button
      type="button"
      onClick={() => isPickupAvailable && setDeliveryOption('pickup')}
      disabled={!isPickupAvailable}
      className={`flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 border-2 rounded-lg sm:rounded-xl transition-all min-w-[140px] sm:min-w-0 sm:min-h-[140px] md:min-h-[180px] w-full flex-shrink-0 sm:flex-shrink ${
        deliveryOption === 'pickup' && isPickupAvailable
          ? 'border-blue-500 bg-blue-50'
          : !isPickupAvailable
          ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
      }`}
    >
      <Store className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 mb-1 sm:mb-2 md:mb-3 ${
        deliveryOption === 'pickup' && isPickupAvailable 
          ? 'text-blue-600' 
          : 'text-gray-500'
      }`} />
      <span className="font-bold text-sm sm:text-base md:text-lg text-gray-900">Pickup</span>
      <span className={`mt-0.5 sm:mt-1 md:mt-2 text-xs sm:text-sm md:text-base ${
        deliveryOption === 'pickup' && isPickupAvailable 
          ? 'text-blue-600 font-semibold' 
          : 'text-gray-700'
      }`}>
        {isPickupAvailable ? 'Free' : 'Not Available'}
      </span>
      <div className="mt-2 sm:mt-3 md:mt-4 text-center">
        <p className="font-medium text-xs text-gray-700">Pickup Address:</p>
        <p className="text-gray-600 text-xs mt-0.5 line-clamp-2">{pickupAddress}</p>
      </div>
      {!isPickupAvailable && (
        <div className="mt-2 bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full text-xs">
          Abuja Only
        </div>
      )}
      {deliveryOption === 'pickup' && isPickupAvailable && (
        <div className="mt-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs sm:text-sm">
          Selected
        </div>
      )}
    </button>
  );
}

function DeliveryOption({ deliveryOption, setDeliveryOption, selectedState, getDeliveryFee }: any) {
  return (
    <button
      type="button"
      onClick={() => setDeliveryOption('delivery')}
      className={`flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 border-2 rounded-lg sm:rounded-xl transition-all min-w-[140px] sm:min-w-0 sm:min-h-[140px] md:min-h-[180px] w-full flex-shrink-0 sm:flex-shrink ${
        deliveryOption === 'delivery'
          ? 'border-blue-500 bg-gray-900'
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
      }`}
    >
      <Home className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 mb-1 sm:mb-2 md:mb-3 ${
        deliveryOption === 'delivery' 
          ? 'text-white'
          : 'text-gray-700'
      }`} />
      <span className={`font-bold text-sm sm:text-base md:text-lg ${
        deliveryOption === 'delivery' ? 'text-white' : 'text-gray-900'
      }`}>
        Delivery
      </span>
      <span className={`mt-0.5 sm:mt-1 md:mt-2 text-xs sm:text-sm md:text-base font-semibold ${
        deliveryOption === 'delivery' 
          ? 'text-white' 
          : 'text-gray-900'
      }`}>
        ₦{getDeliveryFee(selectedState).toLocaleString()}
      </span>
      <div className="mt-2 sm:mt-3 md:mt-4 text-center">
        <p className={`font-medium text-xs ${
          deliveryOption === 'delivery' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {selectedState === 'Abuja' 
            ? 'Door-to-door' 
            : 'Park drop-off'
          }
        </p>
        <p className={`text-xs mt-0.5 ${
          deliveryOption === 'delivery' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {selectedState === 'Abuja' 
            ? '3-5 days' 
            : 'Park pickup'
          }
        </p>
      </div>
      {deliveryOption === 'delivery' && (
        <div className="mt-2 bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs sm:text-sm">
          Selected
        </div>
      )}
    </button>
  );
}

function DeliveryInfo({ deliveryOption, isPickupAvailable, selectedState }: any) {
  return (
    <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg ${
      deliveryOption === 'pickup' && isPickupAvailable 
        ? 'bg-blue-50 border border-blue-200'
        : 'bg-gray-900 border border-gray-800'
    }`}>
      <div className="flex items-center">
        {deliveryOption === 'pickup' && isPickupAvailable ? (
          <Store className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" />
        ) : (
          <Home className="w-4 h-4 sm:w-5 sm:h-5 text-white mr-2" />
        )}
        <h4 className={`font-bold text-sm sm:text-base ${
          deliveryOption === 'pickup' && isPickupAvailable 
            ? 'text-blue-900'
            : 'text-white'
        }`}>
          {deliveryOption === 'pickup' && isPickupAvailable 
            ? 'Pickup Information:' 
            : 'Delivery Information:'
          }
        </h4>
      </div>
      <p className={`text-xs sm:text-sm mt-1 sm:mt-2 ${
        deliveryOption === 'pickup' && isPickupAvailable 
          ? 'text-blue-800'
          : 'text-gray-300'
      }`}>
        {deliveryOption === 'pickup' && isPickupAvailable 
          ? `Collect your order from our store in ${selectedState}. We'll contact you when your order is ready for pickup.`
          : selectedState === 'Abuja'
          ? `Your order will be delivered to your address in ${selectedState}. Please ensure someone is available to receive it.`
          : `Your order will be delivered to a designated park in ${selectedState}. You'll need to collect it from the park. We'll provide park details after payment verification.`
        }
      </p>
    </div>
  );
}