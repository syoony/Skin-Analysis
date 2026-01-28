
import React, { useRef, useState, useCallback } from 'react';
import { translations, Language } from '../translations';

interface CameraViewProps {
  onCapture: (image: string) => void;
  onCancel: () => void;
  lang: Language;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onCancel, lang }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const t = translations[lang];

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraActive(true);
      }
    } catch (err) {
      alert("Please allow camera access to use this feature.");
      console.error(err);
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  }, [stream]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        stopCamera();
        onCapture(imageData);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onCapture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[60vh]">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden relative">
        {!isCameraActive ? (
          <div className="flex flex-col items-center justify-center space-y-6 p-10">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500">
              <i className="fa-solid fa-camera text-4xl"></i>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800">{t.readyTitle}</h3>
              <p className="text-sm text-gray-500 mt-2">{t.readySubtitle}</p>
            </div>
            <div className="flex flex-col w-full gap-3">
              <button 
                onClick={startCamera}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl transition shadow-lg"
              >
                {t.useCamera}
              </button>
              <label className="w-full border-2 border-indigo-100 hover:border-indigo-600 hover:bg-indigo-50 text-indigo-600 font-semibold py-4 rounded-xl transition text-center cursor-pointer">
                {t.uploadPhoto}
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
              <button 
                onClick={onCancel}
                className="text-gray-400 font-medium py-2"
              >
                {t.goBack}
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-[500px] object-cover bg-black"
            />
            {/* Guide Overlay */}
            <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-80 border-2 border-white/50 border-dashed rounded-[100px]"></div>
            </div>
            
            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center space-x-8">
              <button 
                onClick={stopCamera}
                className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-white/40 transition"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
              <button 
                onClick={captureImage}
                className="w-20 h-20 bg-white border-4 border-indigo-500 rounded-full flex items-center justify-center hover:scale-105 transition"
              >
                <div className="w-16 h-16 bg-white border-2 border-gray-200 rounded-full"></div>
              </button>
              <div className="w-12 h-12"></div> {/* Spacer */}
            </div>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraView;
