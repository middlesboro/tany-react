import React from 'react';

const QuantityChangeNotification = ({ changes }) => {
  if (!changes || changes.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      {changes.map((change, index) => {
        const isRemoval = change.currentQuantity === 0;
        return (
          <div
            key={index}
            className={`p-4 mb-2 rounded border ${
              isRemoval
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-yellow-50 text-yellow-800 border-yellow-200'
            }`}
          >
            {isRemoval ? (
              <p>
                Produkt <strong>{change.productName}</strong> bol odstránený z košíka, pretože nie je na sklade.
              </p>
            ) : (
              <p>
                Množstvo produktu <strong>{change.productName}</strong> bolo upravené na <strong>{change.currentQuantity} ks</strong>, pretože požadované množstvo ({change.requestedQuantity} ks) nie je na sklade.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default QuantityChangeNotification;
