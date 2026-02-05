export const ORDER_STATUS_MAPPING = {
  'CREATED': 'Objednávka vytvorená',
  'PAID': 'Zaplatená',
  'COD': 'Dobierka',
  'SENT': 'Odoslaná',
  'READY_FOR_PICKUP': 'Pripravená na vyzdvihnutie',
  'PACKING': 'Objednávka sa vybavuje',
  'PACKED': 'Objednávka je zabalená a čaká na expedíciu',
  'DELIVERED': 'Doručená',
  'CANCELED': 'Zrušená'
};

export const ORDER_STATUS_COLORS = {
  'CREATED': 'bg-gray-100 text-gray-800',
  'PAID': 'bg-green-100 text-green-800',
  'COD': 'bg-blue-100 text-blue-800',
  'SENT': 'bg-purple-100 text-purple-800',
  'READY_FOR_PICKUP': 'bg-indigo-100 text-indigo-800',
  'PACKING': 'bg-yellow-100 text-yellow-800',
  'PACKED': 'bg-orange-100 text-orange-800',
  'DELIVERED': 'bg-green-500 text-white',
  'CANCELED': 'bg-red-500 text-white'
};
