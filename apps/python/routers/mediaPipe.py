import os
import io
from datetime import datetime
import math
from fastapi import APIRouter, UploadFile, File
import numpy as np
import cv2
import mediapipe as mp

router = APIRouter(prefix="/mediapipe", tags=["face-recognition-mediapipe"])

UPLOAD_FOLDER = "uploads/mediapipe/input"
OUTPUT_FOLDER = "uploads/mediapipe/output"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Initialize Face Mesh
mp_face_mesh = mp.solutions.face_mesh
mp_drawing = mp.solutions.drawing_utils
face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=True,
    max_num_faces=5,
    refine_landmarks=True,
    min_detection_confidence=0.5
)

@router.post("/detect-face/")
async def detect_faces_mediapipe(file: UploadFile = File(...)):
    try:
        if not file:
            return {"error": "No file uploaded.", "message": "Please provide an image."}

        contents = await file.read()
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        file_path = os.path.join(UPLOAD_FOLDER, filename)

        with open(file_path, "wb") as f:
            f.write(contents)

        npimg = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        print(f"Image shape: {img.shape}")  

        # Draw center area box
        h, w, _ = img.shape
        center_width = w // 3
        center_height = h // 3
        frame_center_x = w // 2
        frame_center_y = h // 2
        
        # Calculate the coordinates for center area box
        center_x1 = frame_center_x - center_width // 2
        center_y1 = frame_center_y - center_height // 2
        center_x2 = frame_center_x + center_width // 2
        center_y2 = frame_center_y + center_height // 2
        
        # Draw center area box in black with 2px thickness
        cv2.rectangle(img, (center_x1, center_y1), (center_x2, center_y2), (0, 0, 0), 2)

        results = face_mesh.process(img_rgb)

        face_data = [] 
        landmark_data = []

        # Constants
        KNOWN_FACE_WIDTH_CM = 16  # Average adult face width
        FOCAL_LENGTH_PX = 600     # Approximate focal length, needs calibration for your camera

        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                # Get left cheek (234) and right cheek (454)
                left_cheek = face_landmarks.landmark[234]
                right_cheek = face_landmarks.landmark[454]
                
                x1, y1 = int(left_cheek.x * w), int(left_cheek.y * h)
                x2, y2 = int(right_cheek.x * w), int(right_cheek.y * h)
                
                # Calculate pixel distance between the two points
                pixel_distance = math.hypot(x2 - x1, y2 - y1)
                
                # Calculate distance to screen
                distance_cm = (KNOWN_FACE_WIDTH_CM * FOCAL_LENGTH_PX) / pixel_distance
                
                # Draw distance info on the image
                mid_x, mid_y = (x1 + x2) // 2, (y1 + y2) // 2
                cv2.putText(img, f"{distance_cm:.1f} cm", (mid_x, mid_y - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)

                # Determine if the face is centered
                is_centered = (
                    center_x1 < mid_x < center_x2 and
                    center_y1 < mid_y < center_y2
                )

                # Determine if face is too small (means too far)
                min_face_pixel_distance = w // 10  # 10% of image width
                is_too_far = pixel_distance < min_face_pixel_distance

                # Draw face detection area (rectangular box around face)
                # Estimate face width and height based on distance between cheeks
                face_width = int(pixel_distance * 1.5)  # Approximate face width
                face_height = int(face_width * 1.3)     # Approximate face height based on width
                
                # Calculate top-left and bottom-right corners of face rectangle
                face_x1 = max(0, mid_x - face_width // 2)
                face_y1 = max(0, mid_y - face_height // 2)
                face_x2 = min(w, mid_x + face_width // 2)
                face_y2 = min(h, mid_y + face_height // 2)
                
                # Draw face rectangle in green with 2px thickness
                cv2.rectangle(img, (face_x1, face_y1), (face_x2, face_y2), (0, 255, 0), 2)

                # Add to results
                face_info = {
                    "distance_cm": round(distance_cm, 2),
                    "mid_point": {"x": mid_x, "y": mid_y},
                    "pixel_distance": round(pixel_distance, 2),
                    "is_centered": is_centered,
                    "is_too_far": is_too_far,
                    "face_bounds": {"x1": face_x1, "y1": face_y1, "x2": face_x2, "y2": face_y2},
                    "img_shape": img.shape,
                }
                face_data.append(face_info)

                print(f"Face Info: {face_info}")

                # Store all landmarks for future use if needed
                single_landmarks = [
                    {"x": int(lm.x * w), "y": int(lm.y * h)}
                    for lm in face_landmarks.landmark
                ]
                landmark_data.append(single_landmarks)

        # Save annotated image
        annotated_filename = f"annotated_{timestamp}_{file.filename}"
        annotated_path = os.path.join(OUTPUT_FOLDER, annotated_filename)
        cv2.imwrite(annotated_path, img)

        return {
            "face_count": len(face_data),
            "faces": face_data,
            # "landmarks": landmark_data,
            "annotated_image_path": annotated_path
        }

    except Exception as e:
        return {"error": str(e), "message": "An error occurred while processing the image."}

@router.get("/mediapipe-test/")
async def hello_world_mediapipe():
    return {"data": "Testing mediapipe router operational."}