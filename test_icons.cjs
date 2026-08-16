
const lucide = require('lucide-react');

const icons = [
  'Truck', 'Wheat', 'Briefcase', 'HardHat', 'ShoppingBag', 'Laptop', 'ChefHat', 'FileText', 'Zap', 'Sparkles',
  'Building2', 'ArrowLeft', 'Home', 'Info', 'FolderOpen', 'ShoppingCart', 'Camera', 'Phone', 'LogIn', 'Menu', 'X',
  'FileSignature', 'CheckCircle', 'CheckCircle2', 'AlertTriangle', 'BarChart3', 'Edit'
];

for (const name of icons) {
  if (!lucide[name]) {
    console.error('UNDEFINED ICON EXPORT AT RUNTIME:', name);
  } else {
    console.log('Valid icon:', name);
  }
}
