import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

function useCamera() {
  const [cameraStream, setCameraStream] =
    useState(null);

  const cameraVideoRef = useRef(null);

  const streamRef = useRef(null);

  // Start camera
  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error(
        "Camera access is not supported in this browser."
      );
    }

    // Already running
    if (streamRef.current) {
      return streamRef.current;
    }

    const stream =
      await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

    streamRef.current = stream;

    setCameraStream(stream);

    return stream;
  }, []);

  // Attach stream to video
  useEffect(() => {
    const video =
      cameraVideoRef.current;

    if (!video) {
      return;
    }

    if (!cameraStream) {
      video.srcObject = null;
      return;
    }

    video.srcObject = cameraStream;

    // Make sure video actually starts playing
    video.play().catch((error) => {
      console.log(
        "Video autoplay waiting:",
        error
      );
    });
  }, [cameraStream]);

  // Stop camera
  const stopCamera = useCallback(() => {
    const stream = streamRef.current;

    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    streamRef.current = null;

    setCameraStream(null);

    if (cameraVideoRef.current) {
      cameraVideoRef.current.srcObject = null;
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      const stream = streamRef.current;

      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }

      streamRef.current = null;
    };
  }, []);

  return {
    cameraStream,
    cameraVideoRef,
    startCamera,
    stopCamera,
  };
}

export default useCamera;