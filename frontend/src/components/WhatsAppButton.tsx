import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const whatsappNumber = '+2347016479713';
  
  return (
    <a
      href={`https://wa.me/${whatsappNumber.replace(/\+/g, '')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 bottom-4 z-50 flex items-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 group"
      onClick={() => {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'whatsapp_click', {
            event_category: 'contact',
            event_label: 'sticky_whatsapp_button',
          });
        }
      }}
    >
      <MessageCircle className="w-6 h-6" />
      <span className="font-medium text-sm hidden sm:inline">Chat on WhatsApp</span>
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
    </a>
  );
};

export default WhatsAppButton;
