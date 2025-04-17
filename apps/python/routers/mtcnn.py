# routers/mtcnn.py
import math
from fastapi import APIRouter, UploadFile, File
from mtcnn import MTCNN
from PIL import Image
import numpy as np
import io
import cv2

router = APIRouter(prefix="/mtcnn", tags=["face-recognition"])
detector = MTCNN()
REAL_EYE_DISTANCE = 6.3  # Average human interpupillary distance
FOCAL_LENGTH = 700  # Focal length of the camera (in pixels)

# Function to calculate distance from eye keypoints
def calculate_distance(left_eye, right_eye, focal_length, real_eye_distance):
    pixel_distance = math.sqrt((left_eye[0] - right_eye[0])**2 + (left_eye[1] - right_eye[1])**2)
    distance = (focal_length * real_eye_distance) / pixel_distance
    return distance

# 1. face > 2
# 2. distance < 100cm
# 3. eye distance < 10cm
@router.post("/detect-face/")
async def detect_face(file: UploadFile = File(...)):

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        image_np = np.array(image)

        result = detector.detect_faces(image_np)

        face_count = len(result)

        # Validation: allow maximum 2 faces
        if face_count >= 2:
            return {
                "error": "Too many faces detected. Maximum allowed is 2.",
                "face_count": face_count
            }

        distances = []

        for face in result:
            keypoints = face.get('keypoints', {})
            if 'left_eye' in keypoints and 'right_eye' in keypoints:
                left_eye = keypoints['left_eye']
                right_eye = keypoints['right_eye']
                distance_cm = calculate_distance(left_eye, right_eye, FOCAL_LENGTH, REAL_EYE_DISTANCE)
                distances.append(distance_cm)

        return {
            "face_count": face_count,
            "distances_cm": distances,
            "raw_output": result
        }
    except Exception as e:
        return {
            "error": str(e),
            "message": "An error occurred while processing the image."
        }

# testing the router is working
@router.get("/hello-world/")
async def helloWorld():
    return {"data": "testing the router is working"}