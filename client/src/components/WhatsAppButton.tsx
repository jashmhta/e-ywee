import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "919876543210"; // placeholder
const DEFAULT_MESSAGE = "Hi ywee — I'd love some help with sizing or an order.";

export function WhatsAppButton() {
  const [show, setShow] = useState(false);

  // Hide for the first 1.5s so it doesn't compete with hero entry
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1400);
    return () => clearTimeout(t);
  }, []);

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with ywee on WhatsApp"
      data-cursor="hover"
      className={`wa-fab ${show ? "is-visible" : ""}`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.001 0C5.373 0 0 5.373 0 12c0 2.117.553 4.107 1.521 5.835L0 24l6.335-1.654C8.06 23.382 9.99 24 12.001 24 18.628 24 24 18.627 24 12c0-6.627-5.372-12-11.999-12zM12 21.84c-1.74 0-3.41-.466-4.866-1.345l-.348-.207-3.62.951.967-3.535-.227-.358C2.823 15.83 2.16 13.961 2.16 12 2.16 6.572 6.572 2.16 12 2.16c5.428 0 9.84 4.412 9.84 9.84 0 5.428-4.412 9.84-9.84 9.84z"/>
      </svg>
      <style>{`
        .wa-fab {
          position: fixed;
          bottom: clamp(24px, 4vw, 36px);
          right: clamp(20px, 4vw, 36px);
          width: 52px;
          height: 52px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #25D366;
          color: #FFF;
          border-radius: 50%;
          box-shadow: 0 6px 24px rgba(37, 211, 102, 0.32), 0 2px 6px rgba(26,25,22,0.18);
          z-index: 48;
          opacity: 0;
          transform: translateY(16px) scale(0.9);
          transition: opacity 0.4s var(--ease-out), transform 0.4s var(--ease-out), box-shadow 0.32s var(--ease-out);
          text-decoration: none;
        }
        .wa-fab.is-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .wa-fab:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 10px 32px rgba(37, 211, 102, 0.40), 0 3px 10px rgba(26,25,22,0.22);
        }
        @media (max-width: 767px) {
          .wa-fab {
            bottom: calc(80px + env(safe-area-inset-bottom));   /* above snitch nav */
            width: 48px; height: 48px;
          }
        }
      `}</style>
    </a>
  );
}
