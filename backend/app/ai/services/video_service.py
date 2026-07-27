import os
import cv2
from ultralytics import YOLO


print("Loading YOLO model...")

model = YOLO("yolov8n.pt")

print("YOLO model loaded successfully.")



def process_video(video_path):

    output_dir = "outputs"

    os.makedirs(
        output_dir,
        exist_ok=True
    )


    output_path = os.path.join(
        output_dir,
        "processed_" + os.path.basename(video_path)
    )



    cap = cv2.VideoCapture(video_path)


    width = int(
        cap.get(cv2.CAP_PROP_FRAME_WIDTH)
    )

    height = int(
        cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
    )


    fps = cap.get(
        cv2.CAP_PROP_FPS
    )


    if fps == 0:
        fps = 25



    total_frames = int(
        cap.get(cv2.CAP_PROP_FRAME_COUNT)
    )



    fourcc = cv2.VideoWriter_fourcc(
        *"mp4v"
    )


    writer = cv2.VideoWriter(

        output_path,

        fourcc,

        fps,

        (width,height)

    )



    detections=[]


    frame_number=0



    while True:


        ret,frame=cap.read()


        if not ret:
            break



        frame_number += 1



        print(
            f"AI Scanning Frame {frame_number}/{total_frames}"
        )



        results=model.predict(

            frame,

            imgsz=640,

            conf=0.35,

            verbose=False

        )



        annotated_frame = results[0].plot()



        writer.write(
            annotated_frame
        )



        for box in results[0].boxes:


            cls=int(box.cls[0])

            conf=float(box.conf[0])


            detections.append({

                "class":
                model.names[cls],

                "confidence":
                round(conf,3)

            })




    cap.release()

    writer.release()



    return {


        "output_video":
        output_path,


        "total_detections":
        len(detections),


        "detections":
        detections

    }