import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import { ToastContainer, toast } from 'react-toastify';
import Confetti from 'react-confetti';
import 'leaflet/dist/leaflet.css';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const questions = [
  {
    clue: "Lets start with something easy! Clue 1: Health",
    coord: { lat: 19.035711856400198, lng: 73.00821688031027},
    sum: "(16*7)-(11*9)" //13
  },
  {
    clue: "Clue 2: Deepcytes office. Dono try karle!",
    coord: { lat: 18.930141310795868, lng: 72.8333758091434},
    sum: "(225/5)-(6*6)" //9
  },
  {
    clue: "Clue 3: First Date?",
    coord: { lat: 19.072175420706646, lng: 72.99872732448767 }, 
    sum: "(8*8)-(20+16)" //18
  },
  {
    clue: "Clue 4: Your favorite place",
    coord: { lat: 19.05179007299502, lng: 72.87518171681664 },
    sum: "20"   //
  },
];

const ClickHandler = ({ setSelectedCoord }) => {
  useMapEvents({
    click(e) {
      setSelectedCoord(e.latlng);
    },
  });
  return null;
};

export default function MapApp() {
  const [selectedCoord, setSelectedCoord] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [start, setStart] = useState(true)
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmit = () => {
    if (!selectedCoord) {
      toast.error("Please select a coordinate.");
      return;
    }

    const isCorrect =
      Math.abs(selectedCoord.lat - currentQuestion.coord.lat) < 0.0003 &&
      Math.abs(selectedCoord.lng - currentQuestion.coord.lng) < 0.0003;

    if (isCorrect) {
      setShowSuccessPopup(true);
    } else {
      toast.error("Wrong coordinate. Try again!");
    }
  };

  const handleContinue = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedCoord(null);
      setShowSuccessPopup(false);
    } else {
      setQuizCompleted(true);
      setShowSuccessPopup(false);
    }
  };
  const handleStart = () => {
   setStart(false)
  };

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <ToastContainer />

      {/* Floating Clue Box */}
      {!quizCompleted && !start && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '15px',
          borderRadius: '8px',
          maxWidth: '300px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          zIndex: 1000,
        }}>
          <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Clue:</h2>
          <p style={{ margin: 0 }}>{currentQuestion.clue}</p>
        </div>
      )}

      {/* Map */}
      <div style={{ filter: showSuccessPopup ? 'blur(5px)' : 'none', transition: 'filter 0.3s' }}>
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '80vh', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler setSelectedCoord={setSelectedCoord} />
          {selectedCoord && <Marker position={selectedCoord} />}
        </MapContainer>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: '#1E40AF',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Submit
          </button>
        </div>
      </div>
      {/* Confetti */}
      {/* {quizCompleted && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
        />
      )} */}
      {/* Final Completion Message */}
      {/* Success Popup */}
      {start && (
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -30%)',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          textAlign: 'center',
          zIndex: 2000,
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Happy Birthday!! 🎉🎉</h2>
          <p style={{ fontSize: '18px', marginBottom: '25px' }}>
           Welcome to the virtual treasure hunt. You have to use your skill to solve the clues!
          </p>
          <button
            onClick={handleStart}
            style={{
              backgroundColor: '#10B981',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Lets Go!
          </button>
        </div>
      )}
<AnimatePresence>
  {showSuccessPopup && (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -30%)',
        backgroundColor: 'white',
        padding: '30px 70px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        textAlign: 'center',
        zIndex: 2000,
        overflow: 'hidden',
      }}
    >
      {/* Confetti inside popup */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <Confetti
          width={700} // match popup width
          height={250} // match popup height
          numberOfPieces={150}
          recycle={false}
          gravity={0.3}
          tweenDuration={5000}
        />
      </div>

      <h2 style={{ fontSize: '24px', marginBottom: '15px', position: 'relative', zIndex: 1 }}>Wohoo!</h2>
      <p style={{ fontSize: '18px', marginBottom: '25px', position: 'relative', zIndex: 1 }}>
        Your gift is waiting on floor {questions[currentQuestionIndex].sum}.
      </p>
      <button
        onClick={handleContinue}
        style={{
          backgroundColor: '#10B981',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        Continue
      </button>
    </motion.div>
  )}
</AnimatePresence>
      {/* Final Completion Message */}
      {quizCompleted && (
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -30%)',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          textAlign: 'center',
          zIndex: 2000,
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>🎉 Congratulations!</h2>
          <p style={{ fontSize: '18px' }}>
            You have completed the map hunt!
            Hope you had fun!
          </p>
        </div>
      )}
    </div>
  );
}
